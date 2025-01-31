import { Notification } from "@/app/(tabs)";
import { API_BASEURL } from "@/constants";
import axios from "axios";

export const getByPlace = async (uuid: string): Promise<Notification[] | null> => {
    try {
        const { data } = await axios.get(`${API_BASEURL}/notifications/place/${uuid}`);

        return data;
    } catch (error) {
        console.error('Error al obtener el lugar:', error);

        return null;
    }
};
