import axios from "axios";
import { request } from "../interfaces/user/user.interface";

export const user = async (data: request): Promise<void> => {
    const response = await axios.post('https://541nf7nbhd.execute-api.us-east-1.amazonaws.com/prod/claro-poc',data);
    return response.data;
};
