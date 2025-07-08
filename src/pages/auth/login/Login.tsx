import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
  <div className="relative w-full h-full overflow-hidden bg-black shadow-lg">
    {/* Reflejo izquierdo */}
    {showReflections && (
      <video
        src="/video3.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-1/4 object-cover transform -scale-x-100 opacity-30 blur-sm"
      />
    )}

    {/* Video central */}
    <video
      src="/video2.mp4"
      autoPlay
      loop
      muted={muted}
      playsInline
      className={`relative z-10 h-full mx-auto object-cover ${
        showReflections ? "w-3/5" : "w-full"
      }`}
    />

    {/* Reflejo derecho */}
    {showReflections && (
      <video
        src="/video3.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 right-0 h-full w-1/4 object-cover opacity-30 blur-sm"
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestDiagnosis>({
    defaultValues: { name: "", email: "" },
  });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (isSuccess) setOpenDialog(true);
  }, [isSuccess]);

  const onSubmit = (formData: RequestDiagnosis) => {
    mutate(formData);
  };

  const unmute = () => setIsMuted(false);
  const handleRegisterClick = () => {
    unmute();
    setShowFormMobile(true);
  };

  // ¿Mostramos reflejos? Solo en desktop o tras pulsar en móvil
  const showReflections = isDesktop || showFormMobile;

  // Wrapper del video
  const videoWrapper = isDesktop
    ? "w-full lg:w-[60%] h-screen"
    : showFormMobile
    ? "w-full h-[60vh]"
    : "w-full h-screen";

  // Wrapper del formulario
  const formWrapper = isDesktop
    ? "w-full lg:w-[40%] h-screen flex items-center justify-center bg-white px-8"
    : `absolute inset-x-0 bottom-0 bg-white px-4 py-6
       transform ${showFormMobile ? "translate-y-0" : "translate-y-full"}
       transition-transform duration-500 ease-out
       flex items-center justify-center`;

  const FormContent = (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <Typography variant="h5" sx={{ fontWeight: 700, color: "#111" }}>
        Regístrate aquí
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
        <TextField
          fullWidth
          label="Nombre"
          {...register("name", { required: "Este campo es requerido" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          fullWidth
          type="email"
          label="Correo"
          {...register("email", { required: "Este campo es requerido" })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <ButtonUI
          text="ACEPTO 🤑"
          isLoading={isLoading}
          className="w-full"
          onClick={handleSubmit(onSubmit)}
        />
      </form>

      {isSuccess && (
        <DialogMedical open={openDialog} onClose={() => setOpenDialog(false)} data={data} />
      )}
    </div>
  );

  return (
    <div
      onClick={isDesktop ? unmute : undefined}
      className="relative flex flex-col lg:flex-row w-full h-screen overflow-hidden"
    >
      {/* Botón móvil */}
      {!isDesktop && !showFormMobile && (
        <button
          onClick={handleRegisterClick}
          className="absolute top-4 right-4 z-20 bg-white/90 text-black px-4 py-2 rounded-full shadow"
        >
          Me interesa 🔥
        </button>
      )}

      {/* Video + reflejos */}
      <div className={videoWrapper}>
        <LoopingVideo muted={isMuted} showReflections={showReflections} />
      </div>

      {/* Formulario */}
      <div className={formWrapper}>{FormContent}</div>
    </div>
  );
};

export default LoginView;
