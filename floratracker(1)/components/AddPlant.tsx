import React, { useState } from 'react';
import { X, Zap, ZapOff, Sparkles, Plus, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface AddPlantProps {
  onAdd: (plant: any) => void;
  onCancel: () => void;
}

export default function AddPlant({ onAdd, onCancel }: AddPlantProps) {
  const [flash, setFlash] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'Monstera Deliciosa',
    notes: ''
  });

  const capturedImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ3SKx6HgPEbRz-MeKYYSvW1S6MVZVPwJK_6kdzaXMzNXOxtqyEiuXkv3FQ8vya88nDZblD_UPzZP6sGXUJXmK98rv1yWdxpbWx0tTrgjmouGsCEbkkdiw6hbfmiIcfHuKxj2gOaof9mUQaYRCT5Wf5sTkR9YKdUMwOYXWsybFonurxLyn28x3vAbWKqMy_saGKj_i3MkBNVAEkPmR5EH4jZmOiD-VVjbOL9r66ex6Qada4I-jMhuK6kyGSiXxBv6sw1WVgDxG2NoG';

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* Camera Viewfinder Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBB3tF82OPTb_1NT1TMcUUR6Z2Jeif5mvt7UK7V934nAb9f8lmZYgo9psoWq1aOWYyfc2V9qsBmW9qSY8kpncX5L3cxWNUS804ulG9v4WpD517dCsXosRR93qBIKJIu_ibPp2PaYuhQwcmLz1k1Mz1cyRsnG2FDILFdJ_oDoHOaaoKOdHQ_px9JRh1bQPzLh48lsthev5UD66tIb-q3aPdWI2krUwu5vwhcQZXwbnlU-WuBK60ogz0Cphcw8T_A_5Dv3FK3PHv3KDHY')` }}
      />
      
      {/* Top Controls */}
      <div className="relative z-10 p-6 flex justify-between items-start pt-12">
        <button 
          onClick={onCancel}
          className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setFlash(!flash)}
          className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          {flash ? <Zap className="w-5 h-5 fill-white" /> : <ZapOff className="w-5 h-5" />}
        </button>
      </div>

      {/* Reticle */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none">
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white/80 rounded-tl-3xl shadow-lg shadow-white/10" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white/80 rounded-tr-3xl shadow-lg shadow-white/10" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white/80 rounded-bl-3xl shadow-lg shadow-white/10" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white/80 rounded-br-3xl shadow-lg shadow-white/10" />
      </div>

      {/* Form Card (Slide up) */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="mt-auto relative z-20 bg-white rounded-t-[40px] shadow-2xl overflow-hidden pb-10"
      >
        <div className="w-full flex justify-center py-4">
          <div className="w-12 h-1.5 rounded-full bg-zinc-200" />
        </div>

        <div className="px-6 space-y-8 mt-2 max-h-[60vh] overflow-y-auto pb-24">
          {/* Header & Thumbnail */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg relative group shrink-0">
               <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <RefreshCcw className="w-5 h-5 text-white" />
               </div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">New Discovery</h2>
              <p className="text-sm text-text-secondary font-medium">Let's identify and add this to your garden.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Plant Name</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary-container/20 outline-none transition-all"
                placeholder="e.g. My Swiss Cheese Plant"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Species (Optional)</label>
              <div className="relative">
                <input 
                  value={formData.species}
                  onChange={e => setFormData({...formData, species: e.target.value})}
                  className="w-full bg-zinc-50 border-none rounded-2xl pl-5 pr-14 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary-container/20 outline-none transition-all"
                  placeholder="Identify Species..."
                />
                <button className="absolute right-3 top-2 w-9 h-9 bg-green-50 text-primary-container rounded-full flex items-center justify-center border border-green-100 hover:bg-green-100 transition-colors">
                  <Sparkles className="w-4 h-4 fill-primary-container/20" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Notes</label>
              <textarea 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary-container/20 outline-none transition-all resize-none"
                placeholder="Where is it located? Any initial thoughts..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
          <button 
            onClick={() => onAdd(formData)}
            className="w-full bg-primary-container text-white font-bold py-5 rounded-full shadow-lg shadow-green-900/10 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add to Garden
          </button>
        </div>
      </motion.div>
    </div>
  );
}
