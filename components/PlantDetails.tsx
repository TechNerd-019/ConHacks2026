import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import {
  Heart,
  Thermometer,
  Droplets,
  Waves,
  ArrowLeft,
  Sun,
  Plus,
  CloudRain,
  Beaker,
  Wind,
  X,
  Trash2,
  Camera,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plant } from "../types";

import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get("window");

interface PlantDetailsProps {
  plant: Plant;
  onBack: () => void;
  onAddSensor: (sensorType: string) => void;
  onRemoveSensor: (sensorType: string) => void;
  onDelete: (plantId: string) => void;
  onUpdatePhoto: (plantId: string, photoUri: string) => void;
}

const SENSOR_METADATA: Record<
  string,
  { label: string; icon: any; color: string; unit: string; subtitle: string }
> = {
  temp: {
    label: "CLIMATE",
    icon: Thermometer,
    color: "#f87171",
    unit: "°",
    subtitle: "Optimal Range",
  },
  moisture: {
    label: "MOISTURE",
    icon: Droplets,
    color: "#166534",
    unit: "%",
    subtitle: "Soil Health",
  },
  light: {
    label: "LIGHT",
    icon: Sun,
    color: "#eab308",
    unit: "%",
    subtitle: "Daily Exposure",
  },
  reservoir: {
    label: "RESERVOIR",
    icon: Waves,
    color: "#166534",
    unit: "%",
    subtitle: "Water Level",
  },
  humidity: {
    label: "HUMIDITY",
    icon: CloudRain,
    color: "#60a5fa",
    unit: "%",
    subtitle: "Air Quality",
  },
  ph: {
    label: "SOIL PH",
    icon: Beaker,
    color: "#c084fc",
    unit: "",
    subtitle: "Acidity",
  },
  co2: {
    label: "CO2",
    icon: Wind,
    color: "#a1a1aa",
    unit: "ppm",
    subtitle: "Ventilation",
  },
};

export default function PlantDetails({
  plant,
  onBack,
  onAddSensor,
  onRemoveSensor,
  onDelete,
  onUpdatePhoto,
}: PlantDetailsProps) {
  const [isAddingSensor, setIsAddingSensor] = useState(false);
  const [sensorToRemove, setSensorToRemove] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sensorData, setSensorData] = useState<any>(null);

  const fetchSensorData = useCallback(async () => {
    try {
      const res = await fetch('http://100.85.228.88:5000/sensors');
      const json = await res.json();
      setSensorData(json);
    } catch {}
  }, []);

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, [fetchSensorData]);

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onUpdatePhoto(plant.id, result.assets[0].uri);
    }
  };

  const activeSensors = Object.keys(plant.metrics) as Array<
    keyof typeof plant.metrics
  >;
  const availableSensors = (
    Object.keys(SENSOR_METADATA) as Array<keyof typeof SENSOR_METADATA>
  ).filter((s) => !activeSensors.includes(s));

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Header */}
        <View style={styles.heroContainer}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => setShowFullImage(true)}>
            <Image source={{ uri: plant.imageUrl }} style={styles.heroImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft color="#ffffff" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.plantName}>{plant.name}</Text>
              <Text style={styles.plantSpecies}>Tropical Evergreen</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.heartButton} onPress={handlePickPhoto}>
                <Camera size={20} color="#166534" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.heartButton, { backgroundColor: '#fef2f2' }]} onPress={() => setShowDeleteConfirm(true)}>
                <Trash2 size={20} color="#f87171" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Vitality Bar */}
          <View style={styles.vitalityContainer}>
            <View style={styles.vitalityHeader}>
              <Text style={styles.vitalityLabel}>OVERALL VITALITY</Text>
              <Text
                style={[
                  styles.vitalityStatus,
                  { color: plant.vitality > 80 ? "#166534" : "#f87171" },
                ]}
              >
                {plant.status}
              </Text>
            </View>
            <View style={styles.vitalityTrack}>
              <LinearGradient
                colors={["#166534", "#4ade80"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.vitalityBar, { width: `${plant.vitality}%` }]}
              />
            </View>
          </View>

          {/* Sensor Grid */}
          <View style={styles.grid}>
            {/* Live Pi Sensors */}
            {sensorData && (
              <>
                <View style={[styles.sensorCard, { backgroundColor: '#fef2f2' }]}>
                  <View style={styles.sensorCardHeader}>
                    <Thermometer size={20} color="#f87171" />
                    <Text style={styles.sensorCardLabel}>CLIMATE</Text>
                  </View>
                  <Text style={styles.sensorCardValue}>
                    {sensorData.temperature_f != null ? `${sensorData.temperature_f}°` : '—'}
                  </Text>
                  <Text style={styles.sensorCardSubtitle}>{sensorData.temperature_c != null ? `${sensorData.temperature_c}°C` : 'Optimal Range'}</Text>
                </View>
                <View style={[styles.sensorCard, { backgroundColor: '#eff6ff' }]}>
                  <View style={styles.sensorCardHeader}>
                    <Droplets size={20} color="#166534" />
                    <Text style={styles.sensorCardLabel}>MOISTURE</Text>
                  </View>
                  <Text style={styles.sensorCardValue}>
                    {sensorData.humidity != null ? `${sensorData.humidity}%` : '—'}
                  </Text>
                  <Text style={styles.sensorCardSubtitle}>Soil Health</Text>
                </View>
                <View style={[styles.sensorCard, { backgroundColor: '#fefce8' }]}>
                  <View style={styles.sensorCardHeader}>
                    <Sun size={20} color="#eab308" />
                    <Text style={styles.sensorCardLabel}>SOIL</Text>
                  </View>
                  <Text style={styles.sensorCardValue}>{sensorData.soil_moisture.raw}</Text>
                  <Text style={styles.sensorCardSubtitle}>{sensorData.soil_moisture.voltage}V</Text>
                </View>
                <View style={[styles.sensorCard, { backgroundColor: '#ecfeff' }]}>
                  <View style={styles.sensorCardHeader}>
                    <Waves size={20} color="#0891b2" />
                    <Text style={styles.sensorCardLabel}>RESERVOIR</Text>
                  </View>
                  <Text style={styles.sensorCardValue}>{sensorData.water_level.raw}</Text>
                  <Text style={styles.sensorCardSubtitle}>{sensorData.water_level.voltage}V</Text>
                </View>
              </>
            )}

            {/* Placeholder sensors from plant data */}
            {activeSensors.map((sensorKey) => {
              const meta = SENSOR_METADATA[sensorKey];
              const value = plant.metrics[sensorKey];
              const Icon = meta.icon;

              return (
                <TouchableOpacity
                  key={sensorKey}
                  style={styles.sensorCard}
                  onLongPress={() => setSensorToRemove(sensorKey)}
                  delayLongPress={800}
                  activeOpacity={0.9}
                >
                  <View style={styles.sensorCardHeader}>
                    <Icon size={20} color={meta.color} />
                    <Text style={styles.sensorCardLabel}>{meta.label}</Text>
                  </View>
                  <View>
                    {value !== undefined && value !== null ? (
                      <Text style={styles.sensorCardValue}>
                        {value}
                        {meta.unit}
                      </Text>
                    ) : (
                      <Text style={styles.sensorCardEmpty}>Empty</Text>
                    )}
                    <Text style={styles.sensorCardSubtitle}>
                      {meta.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Add Sensor Button */}
            <TouchableOpacity
              style={styles.addSensorCard}
              onPress={() => setIsAddingSensor(true)}
              activeOpacity={0.7}
            >
              <View style={styles.addSensorIcon}>
                <Plus size={24} color="#a1a1aa" />
              </View>
              <Text style={styles.addSensorLabel}>Add Sensor</Text>
            </TouchableOpacity>
          </View>

          {/* Profile */}
          <View style={styles.profileSection}>
            <Text style={styles.profileTitle}>Botanical Profile</Text>
            <Text style={styles.profileDescription}>{plant.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Sensor Modal */}
      <Modal visible={isAddingSensor} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setIsAddingSensor(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Track New Data</Text>
              <TouchableOpacity onPress={() => setIsAddingSensor(false)}>
                <X size={24} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {availableSensors.length > 0 ? (
                availableSensors.map((key) => {
                  const meta = SENSOR_METADATA[key];
                  const Icon = meta.icon;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={styles.sensorOption}
                      onPress={() => {
                        onAddSensor(key);
                        setIsAddingSensor(false);
                      }}
                    >
                      <View style={styles.sensorOptionIcon}>
                        <Icon size={20} color={meta.color} />
                      </View>
                      <View style={styles.sensorOptionText}>
                        <Text style={styles.sensorOptionLabel}>
                          {meta.label}
                        </Text>
                        <Text style={styles.sensorOptionSubtitle}>
                          {meta.subtitle}
                        </Text>
                      </View>
                      <Plus size={20} color="#a1a1aa" />
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={styles.emptySensorsText}>
                  All available sensors are being tracked.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Remove Sensor Modal */}
      <Modal visible={!!sensorToRemove} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={styles.confirmModalContent}>
            <View style={styles.confirmIconCont}>
              <Trash2 size={32} color="#f87171" />
            </View>
            <Text style={styles.confirmTitle}>Remove Sensor?</Text>
            <Text style={styles.confirmText}>
              Are you sure you want to stop tracking{" "}
              {sensorToRemove ? SENSOR_METADATA[sensorToRemove]?.label : ""}?
              This action cannot be undone.
            </Text>

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={() => {
                if (sensorToRemove) onRemoveSensor(sensorToRemove);
                setSensorToRemove(null);
              }}
            >
              <Text style={styles.dangerButtonText}>Confirm Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSensorToRemove(null)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Fullscreen Image Modal */}
      <Modal visible={showFullImage} transparent animationType="fade">
        <View style={styles.fullImageOverlay}>
          <Image
            source={{ uri: plant.imageUrl }}
            style={styles.fullImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.fullImageClose} onPress={() => setShowFullImage(false)}>
            <X color="#ffffff" size={24} />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteCard}>
            <Trash2 size={32} color="#f87171" />
            <Text style={styles.deleteTitle}>Delete {plant.name}?</Text>
            <Text style={styles.deleteSubtitle}>This cannot be undone.</Text>
            <View style={styles.deleteButtons}>
              <TouchableOpacity style={styles.deleteCancelBtn} onPress={() => setShowDeleteConfirm(false)}>
                <Text style={styles.deleteCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteConfirmBtn} onPress={() => onDelete(plant.id)}>
                <Text style={styles.deleteConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullImageOverlay: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  fullImageClose: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "80%",
    gap: 12,
  },
  deleteTitle: { fontSize: 20, fontWeight: "bold", color: "#18181b" },
  deleteSubtitle: { fontSize: 14, color: "#71717a" },
  deleteButtons: { flexDirection: "row", gap: 12, marginTop: 8 },
  deleteCancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: "#f4f4f5", alignItems: "center",
  },
  deleteCancelText: { fontWeight: "bold", color: "#18181b" },
  deleteConfirmBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: "#f87171", alignItems: "center",
  },
  deleteConfirmText: { fontWeight: "bold", color: "#fff" },
  liveSensorSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#18181b", marginBottom: 12 },
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    height: 300,
    width: "100%",
    backgroundColor: "#f4f4f5",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  content: {
    padding: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  plantName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#18181b",
    letterSpacing: -0.5,
  },
  plantSpecies: {
    fontSize: 16,
    color: "#71717a",
    fontWeight: "500",
    marginTop: 4,
  },
  heartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f4f4f5",
  },
  vitalityContainer: {
    marginBottom: 32,
  },
  vitalityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  vitalityLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  vitalityStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  vitalityTrack: {
    width: "100%",
    height: 12,
    backgroundColor: "#f4f4f5",
    borderRadius: 6,
    overflow: "hidden",
  },
  vitalityBar: {
    height: "100%",
    borderRadius: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  sensorCard: {
    width: (width - 48 - 16) / 2, // 2 cols minus padding and gap
    aspectRatio: 1,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f9fafb",
    justifyContent: "space-between",
  },
  sensorCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sensorCardLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sensorCardValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#18181b",
    letterSpacing: -1,
  },
  sensorCardEmpty: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d4d4d8",
    fontStyle: "italic",
  },
  sensorCardSubtitle: {
    fontSize: 12,
    color: "#71717a",
    fontWeight: "500",
    marginTop: 4,
  },
  addSensorCard: {
    width: (width - 48 - 16) / 2,
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#e4e4e7",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  addSensorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#a1a1aa",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  addSensorLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#a1a1aa",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  profileSection: {
    marginBottom: 40,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#18181b",
    marginBottom: 12,
  },
  profileDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: "#52525b",
    fontWeight: "500",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#18181b",
  },
  modalScroll: {
    marginBottom: 20,
  },
  sensorOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fafafa",
    borderRadius: 16,
    marginBottom: 12,
  },
  sensorOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f4f4f5",
    marginRight: 16,
  },
  sensorOptionText: {
    flex: 1,
  },
  sensorOptionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#18181b",
  },
  sensorOptionSubtitle: {
    fontSize: 12,
    color: "#71717a",
  },
  emptySensorsText: {
    textAlign: "center",
    paddingVertical: 32,
    color: "#a1a1aa",
    fontSize: 14,
    fontWeight: "500",
  },
  // Confirm Modal Styles
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  confirmModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 32,
    padding: 32,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  confirmIconCont: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#18181b",
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    color: "#71717a",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  dangerButton: {
    width: "100%",
    backgroundColor: "#f87171",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 12,
  },
  dangerButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    width: "100%",
    backgroundColor: "#f4f4f5",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#18181b",
    fontWeight: "bold",
    fontSize: 16,
  },
});
