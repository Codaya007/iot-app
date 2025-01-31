import { Image, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import * as NotificationService from "@/services/NotificationServices";
import * as PlaceService from "@/services/PlaceServices";
import { BleManager } from "react-native-ble-plx";
import { PermissionsAndroid, Platform, Alert } from "react-native";

export type Place = {
  _id: string;
  name: string;
  additionalInformation: string;
  hours: string;
  uuid: string;
  adjacencyPlaces: string[];
  __v: number;
};

export type Notification = {
  _id: string | number;
  placeId: string;
  message: string;
};

const manager = new BleManager();

export default function HomeScreen() {
  const [currentPlaceUUID, setCurrentPlaceUUID] = useState<string | null>();
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bleDevices, setBleDevices] = useState([]);

  useEffect(() => {
    const getPlace = async () => {
      const place = await PlaceService.getByUUID(
        currentPlaceUUID?.toString() || ""
      );

      setCurrentPlace(place);
    };

    const getNotifications = async () => {
      const notifications = await NotificationService.getByPlace(
        currentPlaceUUID?.toString() || ""
      );

      if (notifications) setNotifications(notifications);
      else console.log("No se pudieron obtener las notificaciones por lugar");
    };

    if (currentPlaceUUID) {
      getNotifications();
      getPlace();
    } else {
      setNotifications([]);
      setCurrentPlace(null);
    }
  }, [currentPlaceUUID]);

  useEffect(() => {
    if (Platform.OS === "android") {
      requestPermissions();
    }

    // Escanea dispositivos BLE cuando el componente se monta
    const subscription = manager.onStateChange((state) => {
      if (state === "PoweredOn") {
        startScanning();
        subscription.remove();
      }
    }, true);

    return () => {
      manager.stopDeviceScan();
    };
  }, []);

  // Función para solicitar permisos en Android
  const requestPermissions = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    if (
      granted["android.permission.BLUETOOTH_SCAN"] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted["android.permission.ACCESS_FINE_LOCATION"] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log("Permisos concedidos");
    } else {
      Alert.alert(
        "Permisos necesarios",
        "Se requieren permisos para usar Bluetooth."
      );
    }
  };

  const startScanning = () => {
    console.log("Iniciando escaneo...");
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        return;
      }

      if (device && device.name) {
        console.log("Dispositivo detectado:", device.name);
        // Aquí puedes filtrar por el UUID del beacon que te interesa
        if (device.id === "UUID_DEL_BEACON") {
          setCurrentPlaceUUID(device.id);
        }
      }
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/universidad.png")}
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bienvenido!</ThemedText>
      </ThemedView>
      {currentPlace ? (
        <ThemedView style={styles.stepContainer}>
          <ThemedText>
            En este momento te encuentras cerca de '{currentPlace.name}'
          </ThemedText>

          <ThemedText type="subtitle">Anuncios</ThemedText>
          {notifications.length > 0 ? (
            notifications.map((not) => (
              <ThemedText key={not._id}>{not.message}</ThemedText>
            ))
          ) : (
            <ThemedText>No hay anuncios disponibles.</ThemedText>
          )}
        </ThemedView>
      ) : (
        <ThemedView>
          <ThemedText>
            En este momento no te encuentras cerca de ningún punto 🫤
          </ThemedText>
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    // gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  headerImage: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
  },
});
