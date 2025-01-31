import { Place } from "@/app/(tabs)";
import { API_BASEURL } from "@/constants";
import axios from "axios";

export const getByUUID = async (uuid: string): Promise<Place | null> => {
    try {
        const response = await fetch(`${API_BASEURL}/places/uuid/${uuid}`);

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

export const getById = async (id: string): Promise<Place | null> => {
    // Lógica para buscar el lugar por ID
    try {
        const response = await fetch(`${API_BASEURL}/places/${id}`);

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
    try {
        const { data } = await axios.get(`${API_BASEURL}/places?search=${text}`);


        if (data) {
            return data.results;
        } else {
            return []; // Si no se encuentran resultados
        }
    } catch (error: any) {
        console.error('Error al realizar la búsqueda:');
        console.error(JSON.stringify(error?.response));
        return []; // En caso de error, retornar un arreglo vacío
    }
};
