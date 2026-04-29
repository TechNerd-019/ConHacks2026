import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  X,
  Zap,
  ZapOff,
  Sparkles,
  Plus,
  RefreshCcw,
} from "lucide-react-native";

interface AddPlantProps {
  onAdd: (plant: any) => void;
  onCancel: () => void;
}

export default function AddPlant({ onAdd, onCancel }: AddPlantProps) {
  const [flash, setFlash] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "Monstera Deliciosa",
    notes: "",
  });

  const capturedImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ3SKx6HgPEbRz-MeKYYSvW1S6MVZVPwJK_6kdzaXMzNXOxtqyEiuXkv3FQ8vya88nDZblD_UPzZP6sGXUJXmK98rv1yWdxpbWx0tTrgjmouGsCEbkkdiw6hbfmiIcfHuKxj2gOaof9mUQaYRCT5Wf5sTkR9YKdUMwOYXWsybFonurxLyn28x3vAbWKqMy_saGKj_i3MkBNVAEkPmR5EH4jZmOiD-VVjbOL9r66ex6Qada4I-jMhuK6kyGSiXxBv6sw1WVgDxG2NoG";
  const cameraBg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBB3tF82OPTb_1NT1TMcUUR6Z2Jeif5mvt7UK7V934nAb9f8lmZYgo9psoWq1aOWYyfc2V9qsBmW9qSY8kpncX5L3cxWNUS804ulG9v4WpD517dCsXosRR93qBIKJIu_ibPp2PaYuhQwcmLz1k1Mz1cyRsnG2FDILFdJ_oDoHOaaoKOdHQ_px9JRh1bQPzLh48lsthev5UD66tIb-q3aPdWI2krUwu5vwhcQZXwbnlU-WuBK60ogz0Cphcw8T_A_5Dv3FK3PHv3KDHY";

  return (
    <View style={styles.container}>
      {/* Camera Viewfinder Background */}
      <ImageBackground
        source={{ uri: cameraBg }}
        style={styles.cameraBg}
        imageStyle={{ opacity: 0.7 }}
      >
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={onCancel}>
            <X size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setFlash(!flash)}
          >
            {flash ? (
              <Zap size={20} color="#ffffff" fill="#ffffff" />
            ) : (
              <ZapOff size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Reticle */}
        <View style={styles.reticleContainer}>
          <View style={[styles.reticleCorner, styles.reticleTL]} />
          <View style={[styles.reticleCorner, styles.reticleTR]} />
          <View style={[styles.reticleCorner, styles.reticleBL]} />
          <View style={[styles.reticleCorner, styles.reticleBR]} />
        </View>
      </ImageBackground>

      {/* Form Card */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.sheetContainer}
      >
        <View style={styles.sheet}>
          <View style={styles.handleBar} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetScroll}
          >
            {/* Header & Thumbnail */}
            <View style={styles.sheetHeader}>
              <View style={styles.thumbnailCont}>
                <Image
                  source={{ uri: capturedImage }}
                  style={styles.thumbnail}
                />
                <View style={styles.thumbnailOverlay}>
                  <RefreshCcw size={20} color="#ffffff" />
                </View>
              </View>
              <View>
                <Text style={styles.sheetTitle}>New Discovery</Text>
                <Text style={styles.sheetSubtitle}>
                  Let's identify and add this.
                </Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PLANT NAME</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholder="e.g. My Swiss Cheese Plant"
                  placeholderTextColor="#a1a1aa"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SPECIES (OPTIONAL)</Text>
                <View style={styles.speciesInputCont}>
                  <TextInput
                    style={[styles.input, styles.speciesInput]}
                    value={formData.species}
                    onChangeText={(text) =>
                      setFormData({ ...formData, species: text })
                    }
                    placeholder="Identify Species..."
                    placeholderTextColor="#a1a1aa"
                  />
                  <TouchableOpacity style={styles.sparklesButton}>
                    <Sparkles
                      size={16}
                      color="#166534"
                      fill="rgba(22, 101, 52, 0.2)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NOTES</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(text) =>
                    setFormData({ ...formData, notes: text })
                  }
                  placeholder="Where is it located? Any initial thoughts..."
                  placeholderTextColor="#a1a1aa"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </ScrollView>

          {/* Action button */}
          <View style={styles.actionCont}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => onAdd(formData)}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#ffffff" />
              <Text style={styles.addButtonText}>Add to Garden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  cameraBg: {
    flex: 1,
    width: "100%",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    paddingTop: Platform.OS === "android" ? 48 : 60,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  reticleContainer: {
    position: "absolute",
    top: "35%",
    left: "50%",
    width: 250,
    height: 250,
    marginLeft: -125,
    marginTop: -125,
  },
  reticleCorner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  reticleTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 24,
  },
  reticleTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 24,
  },
  reticleBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 24,
  },
  reticleBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 24,
  },
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "65%",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 24,
  },
  handleBar: {
    width: 48,
    height: 6,
    backgroundColor: "#e4e4e7",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  sheetScroll: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 16,
    marginBottom: 32,
  },
  thumbnailCont: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#18181b",
    letterSpacing: -0.5,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: "#71717a",
    fontWeight: "500",
    marginTop: 4,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#f4f4f5",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 14,
    fontWeight: "600",
    color: "#18181b",
  },
  speciesInputCont: {
    position: "relative",
    justifyContent: "center",
  },
  speciesInput: {
    paddingRight: 56,
  },
  sparklesButton: {
    position: "absolute",
    right: 8,
    width: 36,
    height: 36,
    backgroundColor: "#f0fdf4",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  actionCont: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
  },
  addButton: {
    backgroundColor: "#166534",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 24,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
import { X, Zap, ZapOff, Sparkles, Plus, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";

interface AddPlantProps {
  onAdd: (plant: any) => void;
  onCancel: () => void;
}

export default function AddPlant({ onAdd, onCancel }: AddPlantProps) {
  const [flash, setFlash] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "Monstera Deliciosa",
    notes: "",
  });

  const capturedImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ3SKx6HgPEbRz-MeKYYSvW1S6MVZVPwJK_6kdzaXMzNXOxtqyEiuXkv3FQ8vya88nDZblD_UPzZP6sGXUJXmK98rv1yWdxpbWx0tTrgjmouGsCEbkkdiw6hbfmiIcfHuKxj2gOaof9mUQaYRCT5Wf5sTkR9YKdUMwOYXWsybFonurxLyn28x3vAbWKqMy_saGKj_i3MkBNVAEkPmR5EH4jZmOiD-VVjbOL9r66ex6Qada4I-jMhuK6kyGSiXxBv6sw1WVgDxG2NoG";

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* Camera Viewfinder Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBB3tF82OPTb_1NT1TMcUUR6Z2Jeif5mvt7UK7V934nAb9f8lmZYgo9psoWq1aOWYyfc2V9qsBmW9qSY8kpncX5L3cxWNUS804ulG9v4WpD517dCsXosRR93qBIKJIu_ibPp2PaYuhQwcmLz1k1Mz1cyRsnG2FDILFdJ_oDoHOaaoKOdHQ_px9JRh1bQPzLh48lsthev5UD66tIb-q3aPdWI2krUwu5vwhcQZXwbnlU-WuBK60ogz0Cphcw8T_A_5Dv3FK3PHv3KDHY')`,
        }}
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
          {flash ? (
            <Zap className="w-5 h-5 fill-white" />
          ) : (
            <ZapOff className="w-5 h-5" />
          )}
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
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <RefreshCcw className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
                New Discovery
              </h2>
              <p className="text-sm text-text-secondary font-medium">
                Let's identify and add this to your garden.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">
                Plant Name
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary-container/20 outline-none transition-all"
                placeholder="e.g. My Swiss Cheese Plant"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">
                Species (Optional)
              </label>
              <div className="relative">
                <input
                  value={formData.species}
                  onChange={(e) =>
                    setFormData({ ...formData, species: e.target.value })
                  }
                  className="w-full bg-zinc-50 border-none rounded-2xl pl-5 pr-14 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary-container/20 outline-none transition-all"
                  placeholder="Identify Species..."
                />
                <button className="absolute right-3 top-2 w-9 h-9 bg-green-50 text-primary-container rounded-full flex items-center justify-center border border-green-100 hover:bg-green-100 transition-colors">
                  <Sparkles className="w-4 h-4 fill-primary-container/20" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
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
