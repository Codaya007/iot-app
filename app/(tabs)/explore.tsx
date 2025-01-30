import { StyleSheet, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { RouteProp, useRoute } from "@react-navigation/native";
import { tintColorLight } from "@/constants/Colors";
import { ThemedSearchbar } from "@/components/ThemedSearchBar";
import { useEffect, useState } from "react";
import { place, Place } from ".";
import { ThemedText } from "@/components/ThemedText";
import { Collapsible } from "@/components/Collapsible";
import { UnorderedList } from "@/components/UnorderedList";
import { ThemedButton } from "@/components/ThemedButton";
import { FavoritePlace } from "./favs";
import { getFavPlaces, saveFavPlaces } from "@/utils";
import { ThemedLoader } from "@/components/ThemedLoader";
import * as PlaceServices from "@/services/PlaceServices"; // Asegúrate de que el servicio esté importado

export type RootStackParamList = {
  explore: { placeId?: string }; // Aquí hacemos que placeId sea opcional
};

// Aquí obtenemos el tipo de los parámetros de la ruta 'explore'
type ExploreScreenRouteProp = RouteProp<RootStackParamList, "explore">;

export default function TabTwoScreen() {
  const route = useRoute<ExploreScreenRouteProp>();
  const { placeId } = route?.params || {}; // Obtén el id del lugar si existe
  const [searchText, setsearchText] = useState<string>(""); // Para el texto del buscador
  const [isLoading, setIsLoading] = useState<boolean>(false); // Para el estado de carga
  const [searchResults, setsearchResults] = useState<Place[]>([place]); // Para los resultados de búsqueda
  const [favPlaces, setFavPlaces] = useState<FavoritePlace[]>([]); // Para los lugares favoritos
  const [placeDetail, setPlaceDetail] = useState<Place | null>(null); // Detalles del lugar si se pasa un placeId

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

  const addFavPlace = async (place: Place) => {
    try {
      setFavPlaces([...favPlaces, { _id: place._id, name: place.name }]);
      await saveFavPlaces(favPlaces);
      console.info("Lugar guardado");
    } catch (error) {
      console.error("No se ha podido guardar");
    }
  };

  useEffect(() => {
    loadFavPlaces(); // Llamar la función cuando el componente se monte
  }, []);

  // Lógica para realizar la búsqueda
  const handleSearch = async () => {
    setPlaceDetail(null);

    if (searchText.trim()) {
      setIsLoading(true);
      try {
        // Aquí llamas al servicio de búsqueda
        const results = await PlaceServices.search(searchText); // Asegúrate de que este método exista
        setsearchResults(results);
      } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (placeId) {
      // Si hay un placeId en los parámetros, buscamos el lugar
      const fetchPlaceById = async () => {
        setIsLoading(true);
        try {
          const place = await PlaceServices.getById(placeId); // Llama al servicio para obtener el lugar por ID
          if (place) {
            setPlaceDetail(place); // Si se encuentra, lo guardamos en el estado
          } else {
            setPlaceDetail(null); // Si no se encuentra, dejamos placeDetail como null
          }
        } catch (error) {
          console.error("Error al obtener el lugar:", error);
          setPlaceDetail(null); // Si hay un error, ponemos placeDetail a null
        } finally {
          setIsLoading(false);
        }
      };
      fetchPlaceById(); // Llamar a la función cuando el placeId cambie
    }
  }, [placeId]); // Este efecto depende de placeId

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={250}
          color={tintColorLight}
          name="explore"
          style={styles.headerImage}
        />
      }
    >
      <ThemedSearchbar
        value={searchText}
        onChangeText={(v) => setsearchText(v)}
        placeholder="Secretaría de Computación..."
        onSubmitEditing={handleSearch} // Aquí se llama la búsqueda cuando se presiona Enter
      />
      {isLoading && (
        <View style={styles.centeredContainer}>
          <ThemedLoader />
        </View>
      )}
      {!isLoading && placeDetail && placeId && (
        <View>
          {/* Si existe un lugar, mostramos los detalles del lugar */}
          <ThemedText>{placeDetail.name}</ThemedText>
          <ThemedText>{placeDetail.additionalInformation}</ThemedText>
          <ThemedText>{placeDetail.hours}</ThemedText>
          <UnorderedList data={placeDetail.adjacencyPlaces} />
          {/* Aquí podrías agregar un botón para guardar el lugar si no está en favoritos */}
        </View>
      )}
      {!isLoading &&
        (searchResults.length > 0 ? (
          // Si no hay un placeId, mostramos los resultados de búsqueda
          <View>
            <ThemedText style={styles.results}>
              {searchResults.length} resultados
            </ThemedText>
            {searchResults.map((place) => {
              const saved = favPlaces.find((e) => e._id === place._id);
              return (
                <Collapsible key={place._id} title={place.name}>
                  <ThemedText>{place.additionalInformation}</ThemedText>
                  <ThemedText type="subtitle2">
                    Horario de atención:{" "}
                  </ThemedText>
                  <ThemedText>{place.hours}</ThemedText>
                  <ThemedText type="subtitle2">Lugares cercanos: </ThemedText>
                  <UnorderedList data={place.adjacencyPlaces} />
                  {!saved && (
                    <ThemedButton
                      title="Guardar"
                      type="outline"
                      onPress={() => addFavPlace(place)}
                    />
                  )}
                </Collapsible>
              );
            })}
          </View>
        ) : (
          <ThemedText style={styles.results}>
            No se encontraron resultados
          </ThemedText>
        ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -45,
    left: -30,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  results: {
    flexDirection: "row-reverse",
    color: "#808080",
    fontSize: 14,
  },
  centeredContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
  },
});
