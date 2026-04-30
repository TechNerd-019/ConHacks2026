import React, { useState, useEffect } from 'react';
import { View as RNView, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PlantDetails from './components/PlantDetails';
import Assistant from './components/Assistant';
import AddPlant from './components/AddPlant';
import SensorData from './components/SensorData';
import { View, Plant, Message } from './types';
import { INITIAL_MESSAGES } from './constants';
import { supabase } from './utils/supabase';

export default function App() {
  const [activeView, setActiveView] = useState<View>('garden');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [loading, setLoading] = useState(true);


  // Plant fetching logic using Supabase
  const fetchPlants = async () => {
    const { data, error } = await supabase
      .from('plants')
      .select('*');

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
    fetchPlants();
  }, []);

  // Refetch when returning to garden
  useEffect(() => {
    if (activeView === 'garden') fetchPlants();
  }, [activeView]);

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

  const handleSendMessage = (content: string) => {
    const newUserMsg: Message = {
      id: `m${messages.length + 1}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages([...messages, newUserMsg]);

    setTimeout(() => {
      const botMsg: Message = {
        id: `m${messages.length + 2}`,
        role: 'bot',
        content:
          "I'm processing that. Is there anything else you'd like to know about your garden?",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMsg]);
    }, 1000);
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

  const handleRemoveSensor = (sensorType: string) => {
    if (!selectedPlant) return;

    const updatedPlant = { ...selectedPlant };
    const newMetrics = { ...updatedPlant.metrics };

    delete (newMetrics as any)[sensorType];
    updatedPlant.metrics = newMetrics;

    setPlants(plants.map(p => p.id === updatedPlant.id ? updatedPlant : p));
    setSelectedPlant(updatedPlant);
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
          />
        );

      case 'detail':
        return selectedPlant ? (
          <PlantDetails
            plant={selectedPlant}
            onBack={() => setActiveView('garden')}
            onAddSensor={handleAddSensor}
            onRemoveSensor={handleRemoveSensor}
          />
        ) : null;

      case 'assistant':
        return <Assistant messages={messages} onSendMessage={handleSendMessage} />;

      case 'analytics':
        return <SensorData />;

      case 'add':
        return (
          <AddPlant
            onAdd={handleAddPlant}
            onCancel={() => setActiveView('garden')}
          />
        );

      default:
        return (
          <Dashboard
            plants={plants}
            onSelectPlant={handlePlantSelect}
            onAddClick={() => setActiveView('add')}
          />
        );
    }
  };

  return (
    <>
      <StatusBar
        style={activeView === 'add' || activeView === 'detail' ? 'light' : 'dark'}
      />
      <Layout activeView={activeView} onViewChange={setActiveView}>
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