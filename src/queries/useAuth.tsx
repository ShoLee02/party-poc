import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { RequestDiagnosis } from "../interfaces/auth/auth.interface";
import { useNotification } from "../hooks/useNotification";

export const useLogin = () => {
    const { getSuccess, getError } = useNotification();

    const mutation = useMutation({
        onSuccess: (data) => {
            console.log(data)
            getSuccess('Bienvenido');
        },
        onError: (error) => {
            console.log(error);
            getError('Error al hacer la solicitud');
        },
        mutationFn: (Login: RequestDiagnosis) => login(Login),
    });
    return mutation;
  };