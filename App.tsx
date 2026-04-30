import React, { useState, useEffect } from 'react';
import { View as RNView, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PlantDetails from './components/PlantDetails';
import Assistant from './components/Assistant';
import AddPlant from './components/AddPlant';
import SensorData from './components/SensorData';
import History from './components/History';
import Auth from './components/Auth';
import Profile from './components/Profile';
import { View, Plant, Message } from './types';
import { INITIAL_MESSAGES } from './constants';
import { supabase } from './utils/supabase';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('garden');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Plant fetching logic using Supabase
  const fetchPlants = async () => {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('sort_order');

    if (error) {
      console.error('Error fetching plants:', error.message);
    } else if (data) {
      setPlants(
        data.map((p: any) => ({
          ...p,
          id: String(p.id),
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) fetchPlants();
  }, [session]);

  // Refetch when returning to garden
  useEffect(() => {
    if (session && activeView === 'garden') fetchPlants();
  }, [activeView]);

  if (authLoading) {
    return (
      <RNView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' }}>
        <ActivityIndicator size="large" color="#166534" />
      </RNView>
    );
  }

  if (!session) {
    return <Auth onAuth={() => {}} />;
  }

  // -------------------------
  // UI HANDLERS
  // -------------------------
  const handlePlantSelect = (plant: Plant) => {
    setSelectedPlant(plant);
    setActiveView('detail');
  };

  // -------------------------
  // ADD PLANT (Supabase insert)
  // -------------------------
  const handleAddPlant = async (formData: any) => {
    try {
      // Step 1: Upload photo to Supabase Storage
      let imageUrl = '';
      if (formData.photo) {
        const fileName = `${Date.now()}.jpg`;
        const resp = await fetch(formData.photo);
        const blob = await resp.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();
        const { error: uploadError } = await supabase.storage
          .from('plant-photos')
          .upload(fileName, arrayBuffer, { contentType: 'image/jpeg', upsert: true });

        if (uploadError) {
          console.error('Photo upload failed:', uploadError.message);
        } else {
          const { data: urlData } = supabase.storage
            .from('plant-photos')
            .getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
        }
      }

      // Step 2: Insert plant row with photo URL
      const { data, error } = await supabase
        .from('plants')
        .insert([{
          user_id: session.user.id,
          name: formData.name || 'New Plant',
          species: formData.species || 'Unknown',
          location: 'New Room',
          imageUrl,
          vitality: 80,
          status: 'Good',
          metrics: { temp: 72, moisture: 50, reservoir: 100, light: 75 },
          description: formData.notes || 'A new discovery in your garden.',
          isFavorite: false,
        }])
        .select()
        .single();

      if (error) {
        console.error('DB insert failed:', error.message);
        return;
      }

      // Step 3: Refresh plants and go to garden
      await fetchPlants();
      setActiveView('garden');
    } catch (e: any) {
      console.error('handleAddPlant error:', e.message);
    }
  };

  const handleSendMessage = async (content: string) => {
    const newUserMsg: Message = {
      id: `m${messages.length + 1}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMsg]);

    try {
      const res = await fetch('http://100.85.228.88:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      const botMsg: Message = {
        id: `m${messages.length + 2}`,
        role: 'bot',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: `m${messages.length + 2}`,
        role: 'bot',
        content: 'Sorry, I could not reach the server. Please try again.',
        timestamp: new Date(),
      }]);
    }
  };

  const handleAddSensor = (sensorType: string) => {
    if (!selectedPlant) return;

    const updatedPlant = {
      ...selectedPlant,
      metrics: {
        ...selectedPlant.metrics,
        [sensorType]: undefined,
      },
    };

    setPlants(plants.map(p => p.id === updatedPlant.id ? updatedPlant : p));
    setSelectedPlant(updatedPlant);
  };

  const handleReorder = async (reordered: Plant[]) => {
    setPlants(reordered);
    await Promise.all(
      reordered.map((p, i) =>
        supabase.from('plants').update({ sort_order: i }).eq('id', Number(p.id))
      )
    );
  };

  const handleRemoveSensor = (sensorType: string) => {
    if (!selectedPlant) return;

    const updatedPlant = { ...selectedPlant };
    const newMetrics = { ...updatedPlant.metrics };

    delete (newMetrics as any)[sensorType];
    updatedPlant.metrics = newMetrics;

    setPlants(plants.map(p => p.id === updatedPlant.id ? updatedPlant : p));
    setSelectedPlant(updatedPlant);
  };

  const handleEditPlant = async (plantId: string, fields: { name: string; species: string; description: string }) => {
    const { error } = await supabase.from('plants').update(fields).eq('id', Number(plantId));
    if (error) {
      console.error('Edit failed:', error.message);
      return;
    }
    await fetchPlants();
    setSelectedPlant((prev: any) => prev ? { ...prev, ...fields } : null);
  };

  const handleDeletePlant = async (plantId: string) => {
    const { error } = await supabase.from('plants').delete().eq('id', Number(plantId));
    if (error) {
      console.error('Delete failed:', error.message);
      return;
    }
    setSelectedPlant(null);
    setActiveView('garden');
    await fetchPlants();
  };

  const handleUpdatePhoto = async (plantId: string, photoUri: string) => {
    try {
      const fileName = `${Date.now()}.jpg`;
      const resp = await fetch(photoUri);
      const blob = await resp.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from('plant-photos')
        .upload(fileName, arrayBuffer, { contentType: 'image/jpeg', upsert: true });

      if (uploadError) {
        console.error('Photo upload failed:', uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage.from('plant-photos').getPublicUrl(fileName);
      const { error } = await supabase.from('plants').update({ imageUrl: urlData.publicUrl }).eq('id', Number(plantId));
      if (error) {
        console.error('Update failed:', error.message);
        return;
      }

      await fetchPlants();
      const updated = plants.find(p => p.id === plantId);
      if (updated) setSelectedPlant({ ...updated, imageUrl: urlData.publicUrl });
    } catch (e: any) {
      console.error('Update photo error:', e.message);
    }
  };

  if (loading) {
    return (
      <RNView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </RNView>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'garden':
        return (
          <Dashboard
            plants={plants}
            onSelectPlant={handlePlantSelect}
            onAddClick={() => setActiveView('add')}
            onReorder={handleReorder}
            displayName={session?.user?.user_metadata?.display_name}
          />
        );

      case 'detail':
        return selectedPlant ? (
          <PlantDetails
            plant={selectedPlant}
            onBack={() => setActiveView('garden')}
            onAddSensor={handleAddSensor}
            onRemoveSensor={handleRemoveSensor}
            onDelete={handleDeletePlant}
            onUpdatePhoto={handleUpdatePhoto}
            onEdit={handleEditPlant}
          />
        ) : null;

      case 'assistant':
        return <Assistant messages={messages} onSendMessage={handleSendMessage} />;

      case 'add':
        return (
          <AddPlant
            onAdd={handleAddPlant}
            onCancel={() => setActiveView('garden')}
          />
        );

      case 'profile':
        return (
          <Profile
            onBack={() => setActiveView('garden')}
            email={session?.user?.email || ''}
            avatarUrl={session?.user?.user_metadata?.avatar_url}
            currentDisplayName={session?.user?.user_metadata?.display_name}
          />
        );

      default:
        return (
          <Dashboard
            plants={plants}
            onSelectPlant={handlePlantSelect}
            onAddClick={() => setActiveView('add')}
            onReorder={handleReorder}
            displayName={session?.user?.user_metadata?.display_name}
          />
        );
    }
  };

  return (
    <>
      <StatusBar
        style={activeView === 'add' || activeView === 'detail' ? 'light' : 'dark'}
      />
      <Layout activeView={activeView} onViewChange={setActiveView} onProfilePress={() => setActiveView('profile')}>
        {renderView()}
      </Layout>
    </>
  );
}
const styles = StyleSheet.create({
  analyticsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fafafa',
  },
  analyticsIconBg: {
    width: 80,
    height: 80,
    backgroundColor: '#f0fdf4',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  analyticsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#18181b',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  analyticsSubtitle: {
    fontSize: 16,
    color: '#71717a',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '80%',
  },
});