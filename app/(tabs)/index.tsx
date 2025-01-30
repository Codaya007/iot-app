import { Image, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { saveFavPlaces } from "@/utils";

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

const placeNotifications: Notification[] = [
  {
    _id: 0,
    placeId: "677b54ff4cef74fa72da8705",
    message:
      "Estás cerca de 'Decanato de la Facultad FEINRR'. Oficina del decano de la facultad, Ing. Julio Romero. Horario de atención: De 9am a 12pm y de 3pm a 5pm",
  },
  {
    _id: 1,
    placeId: "677b54ff4cef74fa72da8705",
    message: "Otros lugares cercanos: Salón de eventos 2, Secretaría Decanato",
  },
];

const favPlaces = [
  { _id: "123", name: "Decanato de la facultad" },
  { _id: "456", name: "Director de Computación" },
  { _id: "127", name: "Decanato de la facultad" },
  { _id: "677b54ff4cef74fa72da8705", name: "Director de Computación" },
];

export const place = {
  _id: "677b54ff4cef74fa72da8705",
  name: "Decanato de la Facultad FEINRR",
  additionalInformation: "Oficina del decano de la facultad, Ing. Julio Romero",
  hours: "De 9am a 12pm y de 3pm a 5pm",
  uuid: "12345678-1234-5678-1234-56789abcdef0",
  adjacencyPlaces: ["Salón de eventos 2", "Secretaría Decanato"],
  __v: 0,
};

export default function HomeScreen() {
  const [currentPlace, setCurrentPlace] = useState<Place | null>(place);

  useEffect(() => {
    saveFavPlaces(favPlaces);
  }, []);

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
          {placeNotifications.map((not) => {
            return <ThemedText key={not._id}>{not.message}</ThemedText>;
          })}
        </ThemedView>
      ) : (
        <ThemedView>
          <ThemedText>
            En este momento no te encuentras cerca del decanato FEIRNNR de la
            UNL🫤
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
