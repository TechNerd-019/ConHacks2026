import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import {
  Home,
  BarChart2,
  PlusCircle,
  Sparkles,
  User,
  Leaf,
} from "lucide-react-native";
import { View as ViewType } from "../types";

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function Layout({
  children,
  activeView,
  onViewChange,
}: LayoutProps) {
  const navItems = [
    { id: "garden", label: "Garden", icon: Home },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
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
        <TouchableOpacity style={styles.userButton}>
          <User size={20} color="#52525b" />
        </TouchableOpacity>
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
import React from "react";
import {
  Home,
  BarChart2,
  PlusCircle,
  Sparkles,
  User,
  Leaf,
} from "lucide-react";
import { View } from "../types.ts";
import { motion, AnimatePresence } from "motion/react";

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
}

export default function Layout({
  children,
  activeView,
  onViewChange,
}: LayoutProps) {
  const navItems = [
    { id: "garden", label: "Garden", icon: Home },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "add", label: "Add", icon: PlusCircle },
    { id: "assistant", label: "Assistant", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background-primary shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary-container fill-primary-container" />
          <span className="text-xl font-bold tracking-tighter text-primary-container">
            FloraTracker
          </span>
        </div>
        <button className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
          <User className="w-5 h-5 text-zinc-600" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-zinc-100 flex justify-around items-center h-20 px-4 z-50">
        {navItems.map((item) => {
          const isActive =
            activeView === item.id ||
            (activeView === "detail" && item.id === "garden");
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                isActive
                  ? "text-primary-container font-semibold"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${isActive ? "bg-green-50" : ""}`}
              >
                <Icon
                  className={`w-6 h-6 ${isActive ? "fill-primary-container/10" : ""}`}
                />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
