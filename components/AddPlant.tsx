import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import {
  X,
  Zap,
  ZapOff,
  Sparkles,
  Plus,
  RefreshCcw,
  Camera as CameraIcon,
} from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

interface AddPlantProps {
  onAdd: (plant: any) => void;
  onCancel: () => void;
}

export default function AddPlant({ onAdd, onCancel }: AddPlantProps) {
  const [flash, setFlash] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    species: "Monstera Deliciosa",
    notes: "",
  });
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const screenHeight = Dimensions.get("window").height;
  const sheetMax = screenHeight * 0.55;
  const sheetMin = 140;
  const sheetAnim = useRef(new Animated.Value(sheetMin)).current;
  const sheetOffset = useRef(sheetMin);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newVal = sheetOffset.current - gesture.dy;
        const clamped = Math.max(sheetMin, Math.min(sheetMax, newVal));
        sheetAnim.setValue(clamped);
      },
      onPanResponderRelease: (_, gesture) => {
        const newVal = sheetOffset.current - gesture.dy;
        const target = newVal < (sheetMax + sheetMin) / 2 ? sheetMin : sheetMax;
        sheetOffset.current = target;
        Animated.spring(sheetAnim, {
          toValue: target,
          useNativeDriver: false,
          bounciness: 4,
        }).start();
      },
    })
  ).current;

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const result = await cameraRef.current.takePictureAsync();
    if (result) setPhoto(result.uri);
  };

  return (
    <View style={styles.container}>
      {/* Camera */}
      <View style={styles.cameraBg}>
        {photo ? (
          <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} />
        ) : permission?.granted ? (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
            flash={flash ? "on" : "off"}
          />
        ) : (
          <View style={styles.permissionContainer}>
            <CameraIcon size={40} color="#ffffff" />
            <Text style={styles.permissionText}>
              {permission?.canAskAgain === false
                ? "Camera access denied. Enable in settings."
                : "Camera access needed"}
            </Text>
            {permission?.canAskAgain !== false && (
              <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                <Text style={styles.permissionButtonText}>Grant Access</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={onCancel}>
            <X size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={() => setFlash(!flash)}>
            {flash ? <Zap size={20} color="#ffffff" fill="#ffffff" /> : <ZapOff size={20} color="#ffffff" />}
          </TouchableOpacity>
        </View>

        {/* Reticle */}
        <View style={styles.reticleContainer}>
          <View style={[styles.reticleCorner, styles.reticleTL]} />
          <View style={[styles.reticleCorner, styles.reticleTR]} />
          <View style={[styles.reticleCorner, styles.reticleBL]} />
          <View style={[styles.reticleCorner, styles.reticleBR]} />
        </View>
      </View>

      {/* Capture Button - fades out as sheet rises */}
      {permission?.granted && (
        <Animated.View style={[styles.captureRow, {
          opacity: sheetAnim.interpolate({
            inputRange: [sheetMin, sheetMax],
            outputRange: [1, 0],
          }),
          pointerEvents: sheetOffset.current >= sheetMax ? "none" : "auto",
        }]}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={photo ? () => setPhoto(null) : takePhoto}
          >
            {photo ? (
              <RefreshCcw size={24} color="#ffffff" />
            ) : (
              <View style={styles.captureInner} />
            )}
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Draggable Form Sheet */}
      <Animated.View style={[styles.sheetContainer, { height: sheetAnim }]}>
        <View style={styles.sheet}>
          <View {...panResponder.panHandlers} style={styles.handleArea}>
            <View style={styles.handleBar} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetScroll}>
            <View style={styles.sheetHeader}>
              <View style={styles.thumbnailCont}>
                {photo && <Image source={{ uri: photo }} style={styles.thumbnail} />}
                <View style={styles.thumbnailOverlay}>
                  <RefreshCcw size={20} color="#ffffff" />
                </View>
              </View>
              <View>
                <Text style={styles.sheetTitle}>New Discovery</Text>
                <Text style={styles.sheetSubtitle}>Let's identify and add this.</Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PLANT NAME</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
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
                    onChangeText={(text) => setFormData({ ...formData, species: text })}
                    placeholder="Identify Species..."
                    placeholderTextColor="#a1a1aa"
                  />
                  <TouchableOpacity style={styles.sparklesButton}>
                    <Sparkles size={16} color="#166534" fill="rgba(22, 101, 52, 0.2)" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NOTES</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                  placeholder="Where is it located? Any initial thoughts..."
                  placeholderTextColor="#a1a1aa"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.actionCont}>
            <TouchableOpacity style={styles.addButton} onPress={() => onAdd({ ...formData, photo })} activeOpacity={0.8}>
              <Plus size={20} color="#ffffff" />
              <Text style={styles.addButtonText}>Add to Garden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  cameraBg: { flex: 1, width: "100%", backgroundColor: "#000" },
  permissionContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    gap: 16,
  },
  permissionText: { color: "#fff", fontSize: 16 },
  permissionButton: { backgroundColor: "#166534", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  permissionButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  captureRow: { position: "absolute", bottom: 160, left: 0, right: 0, alignItems: "center", zIndex: 50, elevation: 30 },
  captureButton: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: "#fff",
    alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)",
  },
  captureInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#fff" },
  topControls: {
    flexDirection: "row", justifyContent: "space-between", padding: 24,
    paddingTop: Platform.OS === "android" ? 48 : 60,
  },
  controlButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)",
  },
  reticleContainer: { position: "absolute", top: "35%", left: "50%", width: 250, height: 250, marginLeft: -125, marginTop: -125 },
  reticleCorner: { position: "absolute", width: 40, height: 40, borderColor: "rgba(255,255,255,0.8)" },
  reticleTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 24 },
  reticleTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 24 },
  reticleBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 24 },
  reticleBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 24 },
  sheetContainer: { position: "absolute", bottom: 0, left: 0, right: 0 },
  sheet: {
    backgroundColor: "#fff", borderTopLeftRadius: 40, borderTopRightRadius: 40, flex: 1,
    shadowColor: "#000", shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 24,
  },
  handleArea: { alignItems: "center", paddingVertical: 12 },
  handleBar: { width: 48, height: 6, backgroundColor: "#e4e4e7", borderRadius: 3 },
  sheetScroll: { paddingHorizontal: 24, paddingBottom: 100 },
  sheetHeader: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 16, marginBottom: 32 },
  thumbnailCont: { width: 80, height: 80, borderRadius: 16, overflow: "hidden", backgroundColor: "#f4f4f5" },
  thumbnail: { width: "100%", height: "100%" },
  thumbnailOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.2)", alignItems: "center", justifyContent: "center" },
  sheetTitle: { fontSize: 24, fontWeight: "900", color: "#18181b", letterSpacing: -0.5 },
  sheetSubtitle: { fontSize: 14, color: "#71717a", fontWeight: "500", marginTop: 4 },
  form: { gap: 24 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 10, fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: 1, marginLeft: 4 },
  input: { backgroundColor: "#f4f4f5", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, fontSize: 14, fontWeight: "600", color: "#18181b" },
  speciesInputCont: { position: "relative", justifyContent: "center" },
  speciesInput: { paddingRight: 56 },
  sparklesButton: {
    position: "absolute", right: 8, width: 36, height: 36, backgroundColor: "#f0fdf4",
    borderRadius: 18, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#dcfce7",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  actionCont: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#f4f4f5" },
  addButton: { backgroundColor: "#166534", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 24 },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
