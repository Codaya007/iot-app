import { Place } from "@/app/(tabs)";
import { API_BASEURL } from "@/constants";

export const getById = async (id: string): Promise<Place | null> => {
    // Lógica para buscar el lugar por ID
    try {
        const response = await fetch(`${API_BASEURL}/${id}`);

        if (response.ok) {
            const data: Place = await response.json();
            return data;
        } else {
            return null; // Si no se encuentra el lugar
        }
    } catch (error) {
        console.error('Error al obtener el lugar:', error);
        return null;
    }
};

export const search = async (text: string): Promise<Place[]> => {
    // Lógica para realizar la búsqueda
    try {
        const response = await fetch(`${API_BASEURL}/places?search=${text}`);
        if (response.ok) {
            const data: Place[] = await response.json();
            return data;
        } else {
            return []; // Si no se encuentran resultados
        }
    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
        return []; // En caso de error, retornar un arreglo vacío
    }
};
