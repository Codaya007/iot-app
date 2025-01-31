import { Notification } from "@/app/(tabs)";
import { API_BASEURL } from "@/constants";

export const getByPlace = async (uuid: string): Promise<Notification[] | null> => {
    try {
        const response = await fetch(`${API_BASEURL}/notifications/place/${uuid}`);

        if (response.ok) {
            const data: Notification[] = await response.json();

            return data;
        } else {
            return null; // Si no se encuentra el lugar
        }
    } catch (error) {
        console.error('Error al obtener el lugar:', error);
        return null;
    }
};
