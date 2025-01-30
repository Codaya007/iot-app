import { FavoritePlace } from "@/app/(tabs)/favs";
import { FAV_PLACES_ASYNCSTORAGE_ITEM_NAME } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveFavPlaces = async (places: FavoritePlace[]) => {
    try {
        await AsyncStorage.setItem(FAV_PLACES_ASYNCSTORAGE_ITEM_NAME, JSON.stringify(places));

        return true;
    } catch (error) {
        console.error('Error al guardar lugares favoritos', error);

        return false;
    }
};

export const getFavPlaces = async (): Promise<FavoritePlace[]> => {
    try {
        const storedPlaces = await AsyncStorage.getItem(FAV_PLACES_ASYNCSTORAGE_ITEM_NAME);

        if (storedPlaces) {
            return JSON.parse(storedPlaces)
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error al cargar lugares favoritos", error);

        return [];
    }
};