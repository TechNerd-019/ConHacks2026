import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Camera, ArrowUp, ArrowDown, GripVertical, Thermometer, Droplets, Sun, Waves } from "lucide-react-native";
import { Plant } from "../types";

interface DashboardProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onAddClick: () => void;
  onReorder?: (plants: Plant[]) => void;
  displayName?: string;
}

export default function Dashboard({
  plants,
  onSelectPlant,
  onAddClick,
  onReorder,
  displayName,
}: DashboardProps) {
  const [reordering, setReordering] = useState(false);
  const [latest, setLatest] = useState<any>(null);

  const fetchLatest = useCallback(async () => {
    try {
      const res = await fetch('http://100.85.228.88:5000/history?limit=1');
      const json = await res.json();
      if (json.length > 0) setLatest(json[0]);
    } catch {}
  }, []);

  useEffect(() => {
    fetchLatest();
    const interval = setInterval(fetchLatest, 10000);
    return () => clearInterval(interval);
  }, [fetchLatest]);

  const moveUp = (index: number) => {
    if (index === 0 || !onReorder) return;
    const arr = [...plants];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    onReorder(arr);
  };

  const moveDown = (index: number) => {
    if (index === plants.length - 1 || !onReorder) return;
    const arr = [...plants];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    onReorder(arr);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Hello, {displayName || 'Gardener'}</Text>
            <Text style={styles.subtitle}>
              Your indoor oasis is thriving today.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.reorderBtn, reordering && styles.reorderBtnActive]}
            onPress={() => setReordering(!reordering)}
          >
            <GripVertical size={18} color={reordering ? "#fff" : "#166534"} />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {plants.map((plant, index) => (
            <TouchableOpacity
              key={plant.id}
              activeOpacity={0.9}
              onPress={() => !reordering && onSelectPlant(plant)}
              style={styles.card}
            >
              {reordering && (
                <View style={styles.reorderControls}>
                  <TouchableOpacity style={styles.arrowBtn} onPress={() => moveUp(index)} disabled={index === 0}>
                    <ArrowUp size={18} color={index === 0 ? "#d4d4d8" : "#166534"} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.arrowBtn} onPress={() => moveDown(index)} disabled={index === plants.length - 1}>
                    <ArrowDown size={18} color={index === plants.length - 1 ? "#d4d4d8" : "#166534"} />
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.imageContainer}>
                <Image source={plant.imageUrl ? { uri: plant.imageUrl } : undefined} style={styles.image} />
                <View style={styles.badge}>
                  <View
                    style={[
                      styles.badgeDot,
                      {
                        backgroundColor:
                          plant.vitality > 80
                            ? "#166534"
                            : plant.vitality > 40
                              ? "#eab308"
                              : "#f87171",
                      },
                    ]}
                  />
                  <Text style={styles.badgeText}>{plant.vitality}%</Text>
                </View>
              </View>

              <View style={styles.info}>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text style={styles.plantMeta}>
                  {plant.location} • {plant.species}
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${plant.vitality}%`,
                      backgroundColor:
                        plant.vitality > 80
                          ? "#166534"
                          : plant.vitality > 40
                            ? "#eab308"
                            : "#f87171",
                    },
                  ]}
                />
              </View>

              {latest && (
                <View style={styles.sensorStrip}>
                  <View style={styles.sensorItem}>
                    <Thermometer size={12} color="#f87171" />
                    <Text style={styles.sensorText}>{latest.temperature_f}°F</Text>
                  </View>
                  <View style={styles.sensorItem}>
                    <Droplets size={12} color="#60a5fa" />
                    <Text style={styles.sensorText}>{latest.humidity}%</Text>
                  </View>
                  <View style={styles.sensorItem}>
                    <Sun size={12} color="#eab308" />
                    <Text style={styles.sensorText}>{latest.soil_moisture_raw}</Text>
                  </View>
                  <View style={styles.sensorItem}>
                    <Waves size={12} color="#0891b2" />
                    <Text style={styles.sensorText}>{latest.water_level_raw}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  reorderBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#f0fdf4",
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#dcfce7",
  },
  reorderBtnActive: { backgroundColor: "#166534", borderColor: "#166534" },
  reorderControls: {
    position: "absolute", right: 8, top: 8, zIndex: 10, flexDirection: "column", gap: 4,
  },
  arrowBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: "#f0fdf4",
    alignItems: "center", justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#18181b", // text-primary
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "#71717a", // text-secondary
    marginTop: 4,
  },
  grid: {
    gap: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f9fafb",
  },
  imageContainer: {
    aspectRatio: 4 / 3,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f4f4f5",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#18181b",
  },
  info: {
    marginBottom: 12,
  },
  plantName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#18181b",
  },
  plantMeta: {
    fontSize: 14,
    color: "#71717a",
    fontWeight: "500",
    marginTop: 2,
  },
  progressTrack: {
    width: "100%",
    height: 6,
    backgroundColor: "#f4f4f5",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  sensorStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
  },
  sensorItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  sensorText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#52525b",
  },
  fab: {
    position: "absolute",
    bottom: 24, // Space enough above the bottom navigation
    right: 24,
    backgroundColor: "#166534",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#14532d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
});
