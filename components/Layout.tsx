import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import {
  Home,
  BarChart2,
  PlusCircle,
  Sparkles,
  User,
  Leaf,
  Bell,
} from "lucide-react-native";
import { View as ViewType } from "../types";
import { supabase } from "../utils/supabase";

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onProfilePress: () => void;
  onInboxPress: () => void;
  notificationCount: number;
  avatarUrl?: string;
}

export default function Layout({
  children,
  activeView,
  onViewChange,
  onProfilePress,
  onInboxPress,
  notificationCount,
  avatarUrl,
}: LayoutProps) {
  const navItems = [
    { id: "garden", label: "Garden", icon: Home },
    { id: "add", label: "Add", icon: PlusCircle },
    { id: "assistant", label: "Assistant", icon: Sparkles },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Leaf size={24} color="#166534" fill="#166534" />
          <Text style={styles.headerTitle}>FloraTracker</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={styles.userButton} onPress={onInboxPress}>
            <Bell size={20} color="#52525b" />
            {notificationCount > 0 && (
              <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: '#dc2626', borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: 'bold' }}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.userButton} onPress={onProfilePress}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={{ width: 32, height: 32, borderRadius: 16 }} />
            ) : (
              <User size={20} color="#52525b" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.main}>{children}</View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => {
          const isActive =
            activeView === item.id ||
            (activeView === "detail" && item.id === "garden");
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onViewChange(item.id as ViewType)}
              style={styles.navItem}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive && styles.iconContainerActive,
                ]}
              >
                <Icon
                  size={24}
                  color={isActive ? "#166534" : "#a1a1aa"}
                  fill={isActive ? "rgba(22, 101, 52, 0.1)" : "transparent"}
                />
              </View>
              <Text
                style={[styles.navLabel, isActive && styles.navLabelActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa", // bg-background-primary
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#166534",
    letterSpacing: -0.5,
  },
  userButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f4f4f5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  main: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    padding: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: "#f0fdf4",
  },
  navLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "500",
    color: "#a1a1aa",
    letterSpacing: 0.5,
  },
  navLabelActive: {
    color: "#166534",
    fontWeight: "700",
  },
});
