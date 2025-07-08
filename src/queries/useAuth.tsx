import { useMutation } from "@tanstack/react-query";
import { useNotification } from "../hooks/useNotification";
import { user } from "../api/user";
import { request } from "../interfaces/user/user.interface";

export const useLogin = () => {
    const { getSuccess, getError } = useNotification();

    const mutation = useMutation({
        onSuccess: (data) => {
            console.log(data)
            getSuccess('Listo !!!!!');
        },
        onError: (error) => {
            console.log(error)
            getError('Error al hacer la solicitud');
        },
        mutationFn: (Login: request) => user(Login),
    });
    return mutation;
  };
