import axios from "axios";
import { API_URL } from "../services";
import { MedicalRecommendationResponse } from "../interfaces/user/user.interface";
import { RequestDiagnosis } from "../interfaces/auth/auth.interface";
import { getHeaders } from "../utils/authorization";

export const login = async (credetials: RequestDiagnosis): Promise<MedicalRecommendationResponse>  => {
    const headers = getHeaders();
    const response = await axios.post(API_URL + 'diagnosis', credetials, { headers });
    return response.data;
};