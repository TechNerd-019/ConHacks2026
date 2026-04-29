import React, { useState, useRef } from 'react';
import { Heart, Thermometer, Droplets, Waves, ArrowLeft, Sun, Plus, CloudRain, Beaker, Wind, X, Trash2 } from 'lucide-react';
import { Plant } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';

interface PlantDetailsProps {
  plant: Plant;
  onBack: () => void;
  onAddSensor: (sensorType: string) => void;
  onRemoveSensor: (sensorType: string) => void;
}

const SENSOR_METADATA: Record<string, { label: string, icon: any, color: string, unit: string, subtitle: string }> = {
  temp: { label: 'CLIMATE', icon: Thermometer, color: 'text-alert-coral', unit: '°', subtitle: 'Optimal Range' },
  moisture: { label: 'MOISTURE', icon: Droplets, color: 'text-primary-container', unit: '%', subtitle: 'Soil Health' },
  light: { label: 'LIGHT', icon: Sun, color: 'text-yellow-500', unit: '%', subtitle: 'Daily Exposure' },
  reservoir: { label: 'RESERVOIR', icon: Waves, color: 'text-primary-container', unit: '%', subtitle: 'Water Level' },
  humidity: { label: 'HUMIDITY', icon: CloudRain, color: 'text-blue-400', unit: '%', subtitle: 'Air Quality' },
  ph: { label: 'SOIL PH', icon: Beaker, color: 'text-purple-400', unit: '', subtitle: 'Acidity' },
  co2: { label: 'CO2', icon: Wind, color: 'text-zinc-400', unit: 'ppm', subtitle: 'Ventilation' },
};

export default function PlantDetails({ plant, onBack, onAddSensor, onRemoveSensor }: PlantDetailsProps) {
  const [isAddingSensor, setIsAddingSensor] = useState(false);
  const [sensorToRemove, setSensorToRemove] = useState<string | null>(null);
  const longPressTimer = useRef<any>(null);

  const activeSensors = Object.keys(plant.metrics) as Array<keyof typeof plant.metrics>;
  const availableSensors = (Object.keys(SENSOR_METADATA) as Array<keyof typeof SENSOR_METADATA>).filter(
    s => !activeSensors.includes(s)
  );

  const handlePointerDown = (sensorKey: string) => {
    longPressTimer.current = setTimeout(() => {
      setSensorToRemove(sensorKey);
    }, 800);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-32">
      {/* Hero Header */}
      <div className="relative h-[300px] w-full bg-surface-container-high rounded-b-[40px] overflow-hidden shadow-lg">
        <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-white/40 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 py-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">{plant.name}</h1>
            <p className="text-lg text-text-secondary font-medium">Tropical Evergreen</p>
          </div>
          <button className="w-12 h-12 rounded-full bg-white shadow-ambient flex items-center justify-center border border-zinc-100 text-alert-coral">
            <Heart className={`w-6 h-6 ${plant.isFavorite ? 'fill-alert-coral' : ''}`} />
          </button>
        </div>

        {/* Vitality Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">OVERALL VITALITY</span>
            <span className={`text-sm font-bold ${
              plant.vitality > 80 ? 'text-primary-container' : 'text-alert-coral'
            }`}>{plant.status}</span>
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden shadow-inner relative">
            <div 
              className={`absolute left-0 top-0 h-full bg-gradient-to-r from-primary-container to-inverse-primary rounded-full transition-all duration-1000 shadow-sm`}
              style={{ width: `${plant.vitality}%` }}
            />
          </div>
        </div>

        {/* Sensor Grid (Bento) */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {activeSensors.map((sensorKey) => {
            const meta = SENSOR_METADATA[sensorKey];
            const value = plant.metrics[sensorKey];
            const Icon = meta.icon;

            return (
              <motion.div 
                layout
                key={sensorKey}
                onPointerDown={() => handlePointerDown(sensorKey)}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="bg-white rounded-[24px] p-5 shadow-ambient border border-zinc-50 flex flex-col justify-between aspect-square select-none cursor-pointer active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-2 text-text-secondary">
                  <Icon className={`w-5 h-5 ${meta.color}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{meta.label}</span>
                </div>
                <div>
                  {value !== undefined && value !== null ? (
                    <div className="text-4xl font-bold text-text-primary tracking-tighter">
                      {value}{meta.unit}
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-zinc-300 italic tracking-tight">Empty</div>
                  )}
                  <p className="text-xs text-text-secondary font-medium mt-1">{meta.subtitle}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Add Sensor Button Card */}
          <motion.button
            layout
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingSensor(true)}
            className="rounded-[24px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center aspect-square text-zinc-400 hover:border-primary-container/20 hover:text-primary-container hover:bg-green-50/30 transition-all"
          >
            <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center mb-2">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Add Sensor</span>
          </motion.button>
        </div>

        {/* Profile */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-text-primary mb-3">Botanical Profile</h3>
          <p className="text-text-secondary leading-relaxed font-medium">
            {plant.description}
          </p>
        </section>
      </div>

      {/* Add Sensor Modal */}
      <AnimatePresence>
        {isAddingSensor && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingSensor(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-sm bg-white rounded-t-[32px] rounded-b-[32px] shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-text-primary">Track New Data</h3>
                <button onClick={() => setIsAddingSensor(false)}><X className="w-6 h-6 text-zinc-400" /></button>
              </div>
              
              <div className="grid grid-cols-1 gap-3 max-h-[40vh] overflow-y-auto pr-2">
                {availableSensors.length > 0 ? availableSensors.map(key => {
                  const meta = SENSOR_METADATA[key];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        onAddSensor(key);
                        setIsAddingSensor(false);
                      }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 hover:bg-green-50 hover:text-primary-container transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                        <Icon className={`w-5 h-5 ${meta.color}`} />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-sm tracking-tight">{meta.label}</div>
                        <div className="text-xs text-text-secondary">{meta.subtitle}</div>
                      </div>
                      <Plus className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                }) : (
                  <div className="py-8 text-center text-zinc-400 text-sm font-medium">
                    All available sensors are being tracked.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Remove Sensor Confirmation */}
      <AnimatePresence>
        {sensorToRemove && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSensorToRemove(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[32px] p-8 w-full max-w-xs text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-alert-coral" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Remove Sensor?</h3>
              <p className="text-text-secondary text-sm font-medium mb-8">
                Are you sure you want to stop tracking <span className="font-bold text-text-primary">{SENSOR_METADATA[sensorToRemove]?.label}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    onRemoveSensor(sensorToRemove);
                    setSensorToRemove(null);
                  }}
                  className="w-full py-4 bg-alert-coral text-white font-bold rounded-full shadow-lg shadow-red-200 active:scale-95 transition-all"
                >
                  Confirm Remove
                </button>
                <button 
                  onClick={() => setSensorToRemove(null)}
                  className="w-full py-4 bg-zinc-100 text-text-primary font-bold rounded-full active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
