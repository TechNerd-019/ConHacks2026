import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Bell, Droplets, AlertTriangle, Leaf, X, Trash2 } from "lucide-react-native";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "critical" | "reminder" | "info";
  timestamp: Date;
  read: boolean;
}

interface InboxProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

export default function Inbox({ notifications, onDismiss, onClearAll }: InboxProps) {
  const iconMap = {
    critical: <AlertTriangle size={20} color="#dc2626" />,
    reminder: <Droplets size={20} color="#2563eb" />,
    info: <Leaf size={20} color="#166534" />,
  };

  const bgMap = {
    critical: "#fef2f2",
    reminder: "#eff6ff",
    info: "#f0fdf4",
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Bell size={20} color="#18181b" />
          <Text style={styles.title}>Notifications</Text>
          {notifications.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notifications.length}</Text>
            </View>
          )}
        </View>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={onClearAll}>
            <Text style={styles.clearAll}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {notifications.length === 0 && (
          <View style={styles.empty}>
            <Bell size={32} color="#d4d4d8" />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>Flora will notify you when your plants need attention</Text>
          </View>
        )}

        {notifications.map((n) => (
          <View key={n.id} style={[styles.card, { backgroundColor: bgMap[n.type] }]}>  
            <View style={styles.cardLeft}>
              {iconMap[n.type]}
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{n.title}</Text>
                <Text style={styles.cardBody}>{n.body}</Text>
                <Text style={styles.cardTime}>
                  {n.timestamp.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => onDismiss(n.id)} style={styles.dismissBtn}>
              <X size={16} color="#a1a1aa" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 20, fontWeight: "bold", color: "#18181b" },
  badge: {
    backgroundColor: "#dc2626", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  clearAll: { color: "#166534", fontWeight: "600", fontSize: 13 },
  list: { padding: 24, paddingTop: 8 },
  empty: { alignItems: "center", marginTop: 60, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: "600", color: "#a1a1aa" },
  emptySubtext: { fontSize: 13, color: "#d4d4d8", textAlign: "center", maxWidth: "70%" },
  card: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    borderRadius: 14, padding: 14, marginBottom: 10,
  },
  cardLeft: { flexDirection: "row", gap: 12, flex: 1 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "bold", color: "#18181b", marginBottom: 2 },
  cardBody: { fontSize: 13, color: "#52525b", lineHeight: 18 },
  cardTime: { fontSize: 11, color: "#a1a1aa", marginTop: 4 },
  dismissBtn: { padding: 4 },
});
