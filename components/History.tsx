import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Thermometer, Droplets, Sun, Waves, Clock } from "lucide-react-native";

const API_URL = "http://100.85.228.88:5000/history?limit=50";

interface Reading {
  timestamp: string;
  temperature_c: number | null;
  temperature_f: number | null;
  humidity: number | null;
  soil_moisture_raw: number;
  soil_moisture_voltage: number;
  water_level_raw: number;
  water_level_voltage: number;
}

export default function History() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setReadings(json);
      setError(null);
    } catch {
      setError("Cannot reach history API");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>📊 Sensor History</Text>
      <Text style={styles.subtitle}>Data logged every 10 seconds via Snowflake</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {readings.length === 0 && !error && (
        <Text style={styles.empty}>No historical data yet. Check back in 5 minutes.</Text>
      )}

      {readings.map((r, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.cardHeader}>
            <Clock size={14} color="#71717a" />
            <Text style={styles.timestamp}>{formatTime(r.timestamp)}</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.metric}>
              <Thermometer size={16} color="#f87171" />
              <Text style={styles.metricValue}>
                {r.temperature_f != null ? `${r.temperature_f}°F` : "—"}
              </Text>
            </View>
            <View style={styles.metric}>
              <Droplets size={16} color="#60a5fa" />
              <Text style={styles.metricValue}>
                {r.humidity != null ? `${r.humidity}%` : "—"}
              </Text>
            </View>
            <View style={styles.metric}>
              <Sun size={16} color="#eab308" />
              <Text style={styles.metricValue}>{r.soil_moisture_raw}</Text>
            </View>
            <View style={styles.metric}>
              <Waves size={16} color="#0891b2" />
              <Text style={styles.metricValue}>{r.water_level_raw}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  content: { padding: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#18181b", letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: "#71717a", marginBottom: 24, marginTop: 4 },
  error: { color: "#dc2626", fontSize: 14, marginBottom: 16 },
  empty: { color: "#71717a", fontSize: 16, textAlign: "center", marginTop: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  timestamp: { fontSize: 12, color: "#71717a", fontWeight: "600" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  metric: { flexDirection: "row", alignItems: "center", gap: 4 },
  metricValue: { fontSize: 14, fontWeight: "bold", color: "#18181b" },
});
