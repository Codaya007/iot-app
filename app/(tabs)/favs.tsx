import { StyleSheet, FlatList, View, TouchableOpacity } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedButton } from "@/components/ThemedButton";
import { useCallback, useEffect, useState } from "react";
import { getFavPlaces, saveFavPlaces } from "@/utils"; // Asegúrate de tener la función removeFavPlace
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./explore";
import { tintColorLight } from "@/constants/Colors";
import { useFocusEffect } from "@react-navigation/native";

export type FavoritePlace = {
  _id: string;
  name: string;
};

export default function TabThreeScreen() {
  const [favPlaces, setFavPlaces] = useState<FavoritePlace[]>([]);
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "explore">>();

  // Función para obtener los lugares favoritos desde AsyncStorage
  const loadFavPlaces = async () => {
    try {
      const storedPlaces = await getFavPlaces();
      if (storedPlaces) {
        setFavPlaces(storedPlaces);
      }
    } catch (error) {
      console.error("Error al cargar lugares favoritos", error);
    }
  };

  // Función para eliminar un lugar favorito
  const handleRemoveFavorite = async (id: string) => {
    try {
      // Eliminamos del estado local
      const newFavPlaces = favPlaces.filter((place) => place._id !== id);
      setFavPlaces(newFavPlaces);

      // Guardamos en el Storage
      await saveFavPlaces(newFavPlaces);
    } catch (error) {
      console.error("Error al eliminar lugar favorito", error);
    }
  };

  // useEffect(() => {
  //   loadFavPlaces(); // Llamar la función cuando el componente se monte
  // }, []);

  // Función para manejar la navegación al explorar con el id del lugar
  const handleNavigateToExplore = (id: string) => {
    navigation.navigate("explore", { placeId: id }); // Pasa el id del lugar como parámetro
  };

  useFocusEffect(
    useCallback(() => {
      loadFavPlaces();
    }, [])
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={270}
          color={tintColorLight}
          name="place"
          // name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Lugares favoritos</ThemedText>
      </ThemedView>

      {favPlaces.length > 0 ? (
        favPlaces.map((item) => {
          return (
            <View key={item._id} style={styles.placeContainer}>
              <TouchableOpacity
                onPress={() => handleNavigateToExplore(item._id)}
              >
                <ThemedText style={styles.placeName}>{item.name}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRemoveFavorite(item._id)}
                style={styles.iconContainer}
              >
                <IconSymbol
                  name="heart-broken"
                  size={34}
                  color={tintColorLight}
                />
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyStateContainer}>
          <ThemedText>Aún no has guardado lugares favoritos.</ThemedText>
          <ThemedButton title="Explorar" type="solid" targetTab="explore" />
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    // color: "#808080",
    bottom: -50,
    left: -40,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  placeContainer: {
    flexDirection: "row", // Alinea el ícono y el texto horizontalmente
    padding: 10,
    marginVertical: 3,
    borderColor: "#f5f5f5", // Color de fondo de la cajita
    borderWidth: 0.5,
    borderRadius: 10,
    alignItems: "center", // Centra verticalmente el ícono y el texto
    justifyContent: "space-between",
  },
  iconContainer: {
    marginRight: 10, // Espacio entre el ícono y el texto
  },
  placeName: {
    fontSize: 16,
  },
  emptyStateContainer: {
    alignItems: "center", // Centrar el texto y el botón
    justifyContent: "center",
    marginTop: 20,
  },
});
