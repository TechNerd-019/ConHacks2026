import React, { useState } from 'react';
import { View as RNView, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PlantDetails from './components/PlantDetails';
import Assistant from './components/Assistant';
import AddPlant from './components/AddPlant';
import { View, Plant, Message } from './types';
import { INITIAL_PLANTS, INITIAL_MESSAGES } from './constants';

export default function App() {
  const [activeView, setActiveView] = useState<View>('garden');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [plants, setPlants] = useState<Plant[]>(INITIAL_PLANTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const handlePlantSelect = (plant: Plant) => {
    setSelectedPlant(plant);
    setActiveView('detail');
  };

  const handleAddPlant = (formData: any) => {
    const newPlant: Plant = {
      id: `p${plants.length + 1}`,
      name: formData.name || 'New Plant',
      species: formData.species || 'Unknown',
      location: 'New Room',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ3SKx6HgPEbRz-MeKYYSvW1S6MVZVPwJK_6kdzaXMzNXOxtqyEiuXkv3FQ8vya88nDZblD_UPzZP6sGXUJXmK98rv1yWdxpbWx0tTrgjmouGsCEbkkdiw6hbfmiIcfHuKxj2gOaof9mUQaYRCT5Wf5sTkR9YKdUMwOYXWsybFonurxLyn28x3vAbWKqMy_saGKj_i3MkBNVAEkPmR5EH4jZmOiD-VVjbOL9r66ex6Qada4I-jMhuK6kyGSiXxBv6sw1WVgDxG2NoG',
      vitality: 80,
      status: 'Good',
      metrics: { temp: 72, moisture: 50, reservoir: 100, light: 75 },
      description: formData.notes || 'A new discovery in your garden.',
      isFavorite: false
    };
    setPlants([...plants, newPlant]);
    setActiveView('garden');
  };

  const handleSendMessage = (content: string) => {
    const newUserMsg: Message = {
      id: `m${messages.length + 1}`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages([...messages, newUserMsg]);
    
    setTimeout(() => {
      const botMsg: Message = {
        id: `m${messages.length + 2}`,
        role: 'bot',
        content: "I'm processing that. Is there anything else you'd like to know about your garden?",
        timestamp: new Date()
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
        [sensorType]: undefined
      }
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
        return (
          <RNView style={styles.analyticsContainer}>
            <RNView style={styles.analyticsIconBg}>
              <ActivityIndicator size="large" color="#166534" />
            </RNView>
            <Text style={styles.analyticsTitle}>Growth Analytics</Text>
            <Text style={styles.analyticsSubtitle}>Detailed insights and growth trends are being prepared for your garden.</Text>
          </RNView>
        );
      case 'add':
        return <AddPlant onAdd={handleAddPlant} onCancel={() => setActiveView('garden')} />;
      default:
        return <Dashboard plants={plants} onSelectPlant={handlePlantSelect} onAddClick={() => setActiveView('add')} />;
    }
  };

  return (
    <>
      <StatusBar style={activeView === 'add' || activeView === 'detail' ? "light" : "dark"} />
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
  }
});