import { CameraView, useCameraPermissions } from "expo-camera"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { Platform, SafeAreaView, Pressable, StyleSheet, Text, View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Index() {
  const [ip, setIP] = useState<string | null>(null)
  const [permission, requestPermission] = useCameraPermissions()
  const [savedPref, setSavedPref] = useState<null | boolean>(null)
  const [showCamera, setShowCamera] = useState(false)

  useEffect(() => {
    const load = async () => {
      const val = await AsyncStorage.getItem("cameraPermissionGranted")
      if (val !== null) setSavedPref(val === "true")
    }
    load()
  }, [])

  useEffect(() => {
    if (permission?.granted) {
      AsyncStorage.setItem("cameraPermissionGranted", "true")
      setSavedPref(true)
    }
  }, [permission])

  const isGranted = permission?.granted || savedPref

  const handleStartScan = async () => {
    if (!isGranted) {
      const perm = await requestPermission()
      if (!perm.granted) return // user said no
    }

    setShowCamera(true)
  }

  const handleScanResult = ({ data }: { data: string }) => {
    setIP(data)
    setShowCamera(false)
  }

  const handleRescan = () => {
    setIP(null)
    setShowCamera(true)
  }

  if (!showCamera && !isGranted) {
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <StatusBar hidden /> : null}
        <StatusBar style="auto" />

        <Text style={styles.mainText}>Expo QR Code Scanner</Text>
        <Text style={styles.description}>Camera permission is required to scan QR codes</Text>

        <Pressable onPress={handleStartScan} style={[styles.mainBtn, styles.btnYellow]}>
          <Text>Grant Permission & Scan</Text>
        </Pressable>
      </SafeAreaView>
    )
  }

  if (!showCamera && isGranted && !ip) {
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <StatusBar hidden /> : null}
        <StatusBar style="auto" />

        <Text style={styles.mainText}>Expo QR Code Scanner</Text>

        <Pressable onPress={handleStartScan} style={[styles.mainBtn, styles.btnYellow]}>
          <Text>Scan Code</Text>
        </Pressable>
      </SafeAreaView>
    )
  }

  if (showCamera && isGranted) {
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <StatusBar hidden /> : null}

        <CameraView
          style={styles.camStyle}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleScanResult}
        />

        <View style={styles.overlay}>
          <Text style={styles.scanningText}>Scanning QR Code...</Text>
          <Pressable
            onPress={() => setShowCamera(false)}
            style={[styles.mainBtn, styles.btnCancel]}
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  if (ip) {
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === "android" ? <StatusBar hidden /> : null}
        <StatusBar style="auto" />

        <Text style={styles.mainText}>Scan Result</Text>

        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Scanned IP:</Text>
          <Text style={styles.resultValue}>{ip}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <Pressable onPress={handleRescan} style={[styles.mainBtn, styles.btnYellow]}>
            <Text>Scan Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Loading...</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 20,
  },
  mainBtn: {
    width: 200,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  btnYellow: {
    backgroundColor: "yellow",
  },
  btnCancel: {
    backgroundColor: "#ff4444",
  },
  mainText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
    color: "#666",
  },
  camStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
    borderRadius: 10,
  },
  scanningText: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  resultContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    minWidth: 200,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 18,
    color: "#333",
  },
  buttonGroup: {
    alignItems: "center",
    rowGap: 10,
  },
})
