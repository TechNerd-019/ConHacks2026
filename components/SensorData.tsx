import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Thermometer, Droplets, CloudRain, Sun } from "lucide-react-native";

const API_URL = "http://100.85.228.88:5000/sensors";

interface SensorReading {
  temperature_c: number | null;
  temperature_f: number | null;
  humidity: number | null;
  soil_moisture: { raw: number; voltage: number };
  water_level: { raw: number; voltage: number };
}

export default function SensorData() {
  const [data, setData] = useState<SensorReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("Cannot reach sensor API");
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (!data && !error) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#166534" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Live Sensor Data</Text>
      <Text style={styles.subtitle}>Updated every 5 seconds</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {data && (
        <>
          <Card
            icon={<Thermometer size={28} color="#dc2626" />}
            label="Temperature"
            value={
              data.temperature_c != null
                ? `${data.temperature_f}°F / ${data.temperature_c}°C`
                : "Reading..."
            }
            bg="#fef2f2"
          />
          <Card
            icon={<Droplets size={28} color="#2563eb" />}
            label="Humidity"
            value={data.humidity != null ? `${data.humidity}%` : "Reading..."}
            bg="#eff6ff"
          />
          <Card
            icon={<Sun size={28} color="#ca8a04" />}
            label="Soil Moisture"
            value={`${data.soil_moisture.raw} raw (${data.soil_moisture.voltage}V)`}
            bg="#fefce8"
          />
          <Card
            icon={<CloudRain size={28} color="#0891b2" />}
            label="Water Level"
            value={`${data.water_level.raw} raw (${data.water_level.voltage}V)`}
            bg="#ecfeff"
          />
        </>
      )}
    </ScrollView>
  );
}

function Card({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <View style={styles.cardHeader}>
        {icon}
        <Text style={styles.cardLabel}>{label}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  content: { padding: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#18181b",
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 14, color: "#71717a", marginBottom: 24, marginTop: 4 },
  error: { color: "#dc2626", fontSize: 14, marginBottom: 16 },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  cardLabel: { fontSize: 14, fontWeight: "600", color: "#52525b" },
  cardValue: { fontSize: 28, fontWeight: "bold", color: "#18181b" },
});
