/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import PlantDetails from './components/PlantDetails.tsx';
import Assistant from './components/Assistant.tsx';
import AddPlant from './components/AddPlant.tsx';
import { View, Plant, Message } from './types.ts';
import { INITIAL_PLANTS, INITIAL_MESSAGES } from './constants.ts';
import { motion } from 'motion/react';

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
    
    // Simple echo bot response simulation
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
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-background-primary">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6"
            >
              <div className="w-10 h-6 bg-primary-container/20 rounded-md animate-pulse" />
            </motion.div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Growth Analytics</h2>
            <p className="text-text-secondary mt-2 font-medium max-w-xs">Detailed insights and growth trends are being prepared for your garden.</p>
          </div>
        );
      case 'add':
        return <AddPlant onAdd={handleAddPlant} onCancel={() => setActiveView('garden')} />;
      default:
        return <Dashboard plants={plants} onSelectPlant={handlePlantSelect} onAddClick={() => setActiveView('add')} />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </Layout>
  );
}

