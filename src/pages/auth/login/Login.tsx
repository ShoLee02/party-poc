import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import confetti from "canvas-confetti";
import { Typography, TextField, useMediaQuery, useTheme } from "@mui/material";
import { RequestDiagnosis } from "../../../interfaces/auth/auth.interface";
import { useLogin } from "../../../queries/useAuth";
import ButtonUI from "../../../common/Button/ButtonUI";
import DialogMedical from "../../../common/Dialog/Dialog";

interface LoopingVideoProps {
  muted: boolean;
  showReflections: boolean;
}

const LoopingVideo: React.FC<LoopingVideoProps> = ({ muted, showReflections }) => (
  <div className="absolute inset-0 w-full h-full overflow-hidden bg-black shadow-lg">
    {/* reflejo izquierdo */}
    {showReflections && (
      <video
        src="/video3.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="hidden lg:block absolute top-0 left-0 h-full w-1/4 object-cover transform -scale-x-100 opacity-30 blur-sm"
      />
    )}
    {/* video central siempre cubre todo */}
    <video
      src="/video2.mp4"
      autoPlay
      loop
      muted={muted}
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    />
    {/* reflejo derecho */}
    {showReflections && (
      <video
        src="/video3.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="hidden lg:block absolute top-0 right-0 h-full w-1/4 object-cover opacity-30 blur-sm"
      />
    )}
  </div>
);

const LoginView: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [showFormMobile, setShowFormMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const { isLoading, mutate, data, isSuccess } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<RequestDiagnosis>({
    defaultValues: { name: "", email: "" },
  });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (isSuccess) setOpenDialog(true);
  }, [isSuccess]);

  const launchConfetti = () => {
    confetti({ particleCount: 100, spread: 160, startVelocity: 30, colors: ["#FF5733", "#33FFA8", "#3360FF", "#FF33EA"] });
  };

  const onSubmit = (formData: RequestDiagnosis) => {
    mutate(formData);
    launchConfetti();
  };

  const unmute = () => setIsMuted(false);
  const handleRegisterClick = () => {
    unmute();
    setShowFormMobile(true);
  };

  // Mostrar reflejos si desktop o tras pulsar en móvil
  const showReflections = isDesktop || showFormMobile;

  return (
    <div className="relative w-full h-screen overflow-hidden overflow-x-hidden">
      {/* VIDEO DE FONDO */}
      <LoopingVideo muted={isMuted} showReflections={showReflections} />

      {/* DESKTOP: formulario a la derecha */}
      {isDesktop && (
        <div className="absolute inset-y-0 right-0 w-2/5 bg-white flex items-center justify-center px-8">
          <FormContents />
        </div>
      )}

      {/* MÓVIL: botón disparador */}
      {!isDesktop && !showFormMobile && (
        <button
          onClick={handleRegisterClick}
          className="absolute top-4 right-4 z-20 bg-white/90 text-black px-4 py-2 rounded-full shadow"
        >
          Me interesa 🔥
        </button>
      )}

      {/* MÓVIL: formulario deslizable */}
      {!isDesktop && (
        <div
          className={`
            absolute inset-x-0 bottom-0 bg-white px-4 sm:px-6 md:px-8
            h-[55vh]
            transform ${showFormMobile ? "translate-y-0" : "translate-y-full"}
            transition-transform duration-500 ease-out
            flex flex-col items-center justify-center
          `}
        >
          <FormContents />
        </div>
      )}
    </div>
  );

  function FormContents() {
    return (
      <div className="w-full max-w-full sm:max-w-xs md:max-w-md flex flex-col items-center gap-4">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#111",
            textAlign: "center",
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
          }}
        >
          Regístrate aquí
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
          <TextField
            fullWidth
            label="Nombre"
            {...register("name", { required: "Este campo es requerido" })}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ "& .MuiInputBase-input": { fontSize: { xs: "0.875rem", sm: "1rem" } } }}
          />

          <TextField
            fullWidth
            type="email"
            label="Correo"
            {...register("email", { required: "Este campo es requerido" })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ "& .MuiInputBase-input": { fontSize: { xs: "0.875rem", sm: "1rem" } } }}
          />

          <ButtonUI
            text="ACEPTO 🤑"
            isLoading={isLoading}
            className="w-full py-2 text-sm sm:py-3 sm:text-base md:py-4 md:text-lg"
            onClick={handleSubmit(onSubmit)}
          />
        </form>

        {isSuccess && (
          <DialogMedical open={openDialog} onClose={() => setOpenDialog(false)} data={data} />
        )}
      </div>
    );
  }
};

export default LoginView;
