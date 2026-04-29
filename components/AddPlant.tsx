import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  X,
  Zap,
  ZapOff,
  Sparkles,
  Plus,
  RefreshCcw,
} from "lucide-react-native";

interface AddPlantProps {
  onAdd: (plant: any) => void;
  onCancel: () => void;
}

export default function AddPlant({ onAdd, onCancel }: AddPlantProps) {
  const [flash, setFlash] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "Monstera Deliciosa",
    notes: "",
  });

  const capturedImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ3SKx6HgPEbRz-MeKYYSvW1S6MVZVPwJK_6kdzaXMzNXOxtqyEiuXkv3FQ8vya88nDZblD_UPzZP6sGXUJXmK98rv1yWdxpbWx0tTrgjmouGsCEbkkdiw6hbfmiIcfHuKxj2gOaof9mUQaYRCT5Wf5sTkR9YKdUMwOYXWsybFonurxLyn28x3vAbWKqMy_saGKj_i3MkBNVAEkPmR5EH4jZmOiD-VVjbOL9r66ex6Qada4I-jMhuK6kyGSiXxBv6sw1WVgDxG2NoG";
  const cameraBg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBB3tF82OPTb_1NT1TMcUUR6Z2Jeif5mvt7UK7V934nAb9f8lmZYgo9psoWq1aOWYyfc2V9qsBmW9qSY8kpncX5L3cxWNUS804ulG9v4WpD517dCsXosRR93qBIKJIu_ibPp2PaYuhQwcmLz1k1Mz1cyRsnG2FDILFdJ_oDoHOaaoKOdHQ_px9JRh1bQPzLh48lsthev5UD66tIb-q3aPdWI2krUwu5vwhcQZXwbnlU-WuBK60ogz0Cphcw8T_A_5Dv3FK3PHv3KDHY";

  return (
    <View style={styles.container}>
      {/* Camera Viewfinder Background */}
      <ImageBackground
        source={{ uri: cameraBg }}
        style={styles.cameraBg}
        imageStyle={{ opacity: 0.7 }}
      >
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={onCancel}>
            <X size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setFlash(!flash)}
          >
            {flash ? (
              <Zap size={20} color="#ffffff" fill="#ffffff" />
            ) : (
              <ZapOff size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Reticle */}
        <View style={styles.reticleContainer}>
          <View style={[styles.reticleCorner, styles.reticleTL]} />
          <View style={[styles.reticleCorner, styles.reticleTR]} />
          <View style={[styles.reticleCorner, styles.reticleBL]} />
          <View style={[styles.reticleCorner, styles.reticleBR]} />
        </View>
      </ImageBackground>

      {/* Form Card */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.sheetContainer}
      >
        <View style={styles.sheet}>
          <View style={styles.handleBar} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetScroll}
          >
            {/* Header & Thumbnail */}
            <View style={styles.sheetHeader}>
              <View style={styles.thumbnailCont}>
                <Image
                  source={{ uri: capturedImage }}
                  style={styles.thumbnail}
                />
                <View style={styles.thumbnailOverlay}>
                  <RefreshCcw size={20} color="#ffffff" />
                </View>
              </View>
              <View>
                <Text style={styles.sheetTitle}>New Discovery</Text>
                <Text style={styles.sheetSubtitle}>
                  Let's identify and add this.
                </Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PLANT NAME</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholder="e.g. My Swiss Cheese Plant"
                  placeholderTextColor="#a1a1aa"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SPECIES (OPTIONAL)</Text>
                <View style={styles.speciesInputCont}>
                  <TextInput
                    style={[styles.input, styles.speciesInput]}
                    value={formData.species}
                    onChangeText={(text) =>
                      setFormData({ ...formData, species: text })
                    }
                    placeholder="Identify Species..."
                    placeholderTextColor="#a1a1aa"
                  />
                  <TouchableOpacity style={styles.sparklesButton}>
                    <Sparkles
                      size={16}
                      color="#166534"
                      fill="rgba(22, 101, 52, 0.2)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NOTES</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(text) =>
                    setFormData({ ...formData, notes: text })
                  }
                  placeholder="Where is it located? Any initial thoughts..."
                  placeholderTextColor="#a1a1aa"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </ScrollView>

          {/* Action button */}
          <View style={styles.actionCont}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => onAdd(formData)}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#ffffff" />
              <Text style={styles.addButtonText}>Add to Garden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  cameraBg: {
    flex: 1,
    width: "100%",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    paddingTop: Platform.OS === "android" ? 48 : 60,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  reticleContainer: {
    position: "absolute",
    top: "35%",
    left: "50%",
    width: 250,
    height: 250,
    marginLeft: -125,
    marginTop: -125,
  },
  reticleCorner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  reticleTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 24,
  },
  reticleTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 24,
  },
  reticleBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 24,
  },
  reticleBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 24,
  },
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "65%",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 24,
  },
  handleBar: {
    width: 48,
    height: 6,
    backgroundColor: "#e4e4e7",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  sheetScroll: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 16,
    marginBottom: 32,
  },
  thumbnailCont: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#18181b",
    letterSpacing: -0.5,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: "#71717a",
    fontWeight: "500",
    marginTop: 4,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#f4f4f5",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 14,
    fontWeight: "600",
    color: "#18181b",
  },
  speciesInputCont: {
    position: "relative",
    justifyContent: "center",
  },
  speciesInput: {
    paddingRight: 56,
  },
  sparklesButton: {
    position: "absolute",
    right: 8,
    width: 36,
    height: 36,
    backgroundColor: "#f0fdf4",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  actionCont: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
  },
  addButton: {
    backgroundColor: "#166534",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 24,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
