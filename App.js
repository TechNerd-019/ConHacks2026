import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';

const API_URL = 'http://100.85.228.88:5000/sensors';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError('Cannot reach sensor API');
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />}
    >
      <Text style={styles.title}>🌱 Plant Monitor</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {data && (
        <>
          <Card label="🌡️ Temperature" value={data.temperature_c != null ? `${data.temperature_f}°F / ${data.temperature_c}°C` : 'Reading...'} />
          <Card label="💧 Humidity" value={data.humidity != null ? `${data.humidity}%` : 'Reading...'} />
          <Card label="🪴 Soil Moisture" value={`${data.soil_moisture.raw} (${data.soil_moisture.voltage}V)`} />
          <Card label="🚰 Water Level" value={`${data.water_level.raw} (${data.water_level.voltage}V)`} />
        </>
      )}

      {!data && !error && <Text style={styles.loading}>Loading...</Text>}
    </ScrollView>
  );
}

function Card({ label, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 24, paddingTop: 60, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', marginBottom: 24 },
  error: { color: '#ff6b6b', fontSize: 16, marginBottom: 16 },
  loading: { color: '#aaa', fontSize: 18, marginTop: 40 },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
  },
  cardLabel: { color: '#aaa', fontSize: 14, marginBottom: 8 },
  cardValue: { color: '#fff', fontSize: 24, fontWeight: '600' },
});
