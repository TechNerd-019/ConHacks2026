import React, { useState } from "react";
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
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plant } from "../types";

const { width } = Dimensions.get("window");

interface PlantDetailsProps {
  plant: Plant;
  onBack: () => void;
  onAddSensor: (sensorType: string) => void;
  onRemoveSensor: (sensorType: string) => void;
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
}: PlantDetailsProps) {
  const [isAddingSensor, setIsAddingSensor] = useState(false);
  const [sensorToRemove, setSensorToRemove] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);

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
            <TouchableOpacity style={styles.heartButton}>
              <Heart
                size={24}
                color={plant.isFavorite ? "#f87171" : "#a1a1aa"}
                fill={plant.isFavorite ? "#f87171" : "transparent"}
              />
            </TouchableOpacity>
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
