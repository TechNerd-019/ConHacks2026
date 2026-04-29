import React from 'react';
import { Camera } from 'lucide-react';
import { Plant, View } from '../types.ts';
import { motion } from 'motion/react';

interface DashboardProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onAddClick: () => void;
}

export default function Dashboard({ plants, onSelectPlant, onAddClick }: DashboardProps) {
  return (
    <div className="px-5 pt-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Hello, Gardener</h1>
        <p className="text-lg text-text-secondary mt-1">Your indoor oasis is thriving today.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {plants.map((plant, index) => (
          <motion.article
            key={plant.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectPlant(plant)}
            className="group bg-white rounded-3xl p-4 shadow-ambient border border-zinc-50 cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-surface-container-low mb-4 relative">
              <img 
                src={plant.imageUrl} 
                alt={plant.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2 shadow-sm border border-black/5">
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                  plant.vitality > 80 ? 'bg-primary-container' : 
                  plant.vitality > 40 ? 'bg-yellow-500' : 'bg-alert-coral'
                }`}></span>
                <span className="text-xs font-bold text-text-primary tracking-tight">{plant.vitality}%</span>
              </div>
            </div>

            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold text-text-primary tracking-tight">{plant.name}</h3>
                <p className="text-sm text-text-secondary font-medium">{plant.location} • {plant.species}</p>
              </div>
            </div>

            <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden mt-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${plant.vitality}%` }}
                className={`h-full rounded-full ${
                  plant.vitality > 80 ? 'bg-primary-container' : 
                  plant.vitality > 40 ? 'bg-yellow-500' : 'bg-alert-coral'
                }`}
              />
            </div>
          </motion.article>
        ))}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddClick}
        className="fixed bottom-[104px] right-6 bg-primary-container text-white w-14 h-14 rounded-full shadow-lg shadow-green-900/20 flex items-center justify-center z-40"
      >
        <Camera className="w-6 h-6 fill-white" />
      </motion.button>
    </div>
  );
}
