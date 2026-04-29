import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Camera } from "lucide-react-native";
import { Plant } from "../types";

interface DashboardProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onAddClick: () => void;
}

export default function Dashboard({
  plants,
  onSelectPlant,
  onAddClick,
}: DashboardProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Hello, Gardener</Text>
          <Text style={styles.subtitle}>
            Your indoor oasis is thriving today.
          </Text>
        </View>

        <View style={styles.grid}>
          {plants.map((plant) => (
            <TouchableOpacity
              key={plant.id}
              activeOpacity={0.9}
              onPress={() => onSelectPlant(plant)}
              style={styles.card}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: plant.imageUrl }} style={styles.image} />
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
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={onAddClick}
      >
        <Camera color="#ffffff" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
import React from "react";
import { Camera } from "lucide-react";
import { Plant, View } from "../types.ts";
import { motion } from "motion/react";

interface DashboardProps {
  plants: Plant[];
  onSelectPlant: (plant: Plant) => void;
  onAddClick: () => void;
}

export default function Dashboard({
  plants,
  onSelectPlant,
  onAddClick,
}: DashboardProps) {
  return (
    <div className="px-5 pt-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Hello, Gardener
        </h1>
        <p className="text-lg text-text-secondary mt-1">
          Your indoor oasis is thriving today.
        </p>
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
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    plant.vitality > 80
                      ? "bg-primary-container"
                      : plant.vitality > 40
                        ? "bg-yellow-500"
                        : "bg-alert-coral"
                  }`}
                ></span>
                <span className="text-xs font-bold text-text-primary tracking-tight">
                  {plant.vitality}%
                </span>
              </div>
            </div>

            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold text-text-primary tracking-tight">
                  {plant.name}
                </h3>
                <p className="text-sm text-text-secondary font-medium">
                  {plant.location} • {plant.species}
                </p>
              </div>
            </div>

            <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden mt-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${plant.vitality}%` }}
                className={`h-full rounded-full ${
                  plant.vitality > 80
                    ? "bg-primary-container"
                    : plant.vitality > 40
                      ? "bg-yellow-500"
                      : "bg-alert-coral"
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
