import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import confetti from 'canvas-confetti';
import { Typography, TextField, useMediaQuery, useTheme } from "@mui/material";
import { RequestDiagnosis } from "../../../interfaces/auth/auth.interface";
import { useLogin } from "../../../queries/useAuth";
import ButtonUI from "../../../common/Button/ButtonUI";
import DialogMedical from "../../../common/Dialog/Dialog";

interface LoopingVideoProps {
  muted: boolean;
}

const LoopingVideo: React.FC<LoopingVideoProps> = ({ muted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Reflejo izquierdo: oculto en móvil, visible en desktop */}
      <video
        src="/video3.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="hidden lg:block absolute top-0 left-0 h-full w-1/4 object-cover transform -scale-x-100 opacity-30 blur-sm"
      />

      {/* Video principal */}
      <video
        ref={videoRef}
        src="/video2.mp4"
        autoPlay
        loop
        muted={muted}
        playsInline
        className="relative z-10 h-full w-full lg:w-1/2 mx-auto object-cover"
      />

      {/* Reflejo derecho: oculto en móvil, visible en desktop */}
      <video
        src="/video3.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="hidden lg:block absolute top-0 right-0 h-full w-1/4 object-cover opacity-30 blur-sm"
      />
    </div>
  );
};

const LoginView: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [showFormMobile, setShowFormMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const { isLoading, data, isSuccess } = useLogin(); // mutate
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
    console.log("Form data submitted:", formData);
    launchConfetti();
    //mutate(formData);
  };

  const unmute = () => {
    if (isMuted) {
      setIsMuted(false);
    }
  };

  const launchConfetti = () => {
    const confettiSettings = {
      particleCount: 100,
      spread: 160,
      startVelocity: 30,
      colors: ['#FF5733', '#33FFA8', '#3360FF', '#FF33EA'],
    };
    confetti(confettiSettings);
  }

  const handleRegisterClick = () => {
    // en móvil, al clickear botón: desmutea y muestra formulario
    unmute();
    setShowFormMobile(true);
  };

  // Clases para la sección de video
  const videoClasses = isDesktop
    ? "w-full lg:w-[70%] h-screen"
    : showFormMobile
    ? "w-full h-[60vh]"
    : "w-full h-screen";

  // Clases para la sección de formulario
  const formClasses = isDesktop
    ? "w-full lg:w-[30%] h-screen flex items-center justify-center bg-white px-6 py-10"
    : `absolute inset-x-0 bottom-0 bg-white px-4 py-6
       transform ${showFormMobile ? "translate-y-0" : "translate-y-full"}
       transition-transform duration-500 ease-out
       flex items-center justify-center`;

  const FormContent = (
    <div className="w-full max-w-md flex flex-col items-center gap-3">
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#111",
          textAlign: "center",
          fontSize: "1.4rem",
          marginBottom: "0.25rem",
        }}
      >
        Regístrate aquí
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
        <TextField
          fullWidth
          type="text"
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
      onClick={isDesktop ? unmute : undefined} // en desktop, cualquier click desmutea
      className="relative flex flex-col lg:flex-row w-full h-screen bg-white overflow-hidden"
    >
      {/* Botón “Me interesa 🔥” solo en móvil */}
      {!isDesktop && !showFormMobile && (
        <button
          onClick={handleRegisterClick}
          className="absolute top-4 right-4 z-20 bg-white/90 text-black px-3 py-2 rounded-full shadow-md text-sm"
        >
          Me interesa 🔥
        </button>
      )}

      {/* Sección de video */}
      <div className={videoClasses}>
        <LoopingVideo muted={isMuted} />
      </div>

      {/* Sección de formulario */}
      <div className={formClasses}>{FormContent}</div>
    </div>
  );
};

export default LoginView;
