import React, { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import confetti from "canvas-confetti";
import { Typography, TextField, useMediaQuery, useTheme } from "@mui/material";
import { RequestDiagnosis } from "../../../interfaces/auth/auth.interface";
import { useLogin } from "../../../queries/useAuth";
import ButtonUI from "../../../common/Button/ButtonUI";
import DialogMedical from "../../../common/Dialog/Dialog";
import { useNotification } from "../../../hooks/useNotification";
import { useRegistrationStore } from "../../../store";
import { request } from "../../../interfaces/user/user.interface";

interface LoopingVideoProps {
  muted: boolean;
  showReflections: boolean;
  videoKey: number;
}

const LoopingVideo: React.FC<LoopingVideoProps> = ({ muted, showReflections, videoKey }) => {
  const centerClass = showReflections
    ? "absolute inset-y-0 left-1/4 w-1/2 h-full object-contain object-center"
    : "absolute inset-0 w-full h-full object-contain object-center";

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {showReflections && (
        <video
          key={`left-${videoKey}`}
          src="/video3.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-y-0 left-0 w-1/4 h-full object-cover transform -scale-x-100 opacity-30 blur-sm"
        />
      )}
      <video
        key={`main-${videoKey}`}
        src="/video2.mp4"
        autoPlay
        loop
        muted={muted}
        playsInline
        className={centerClass}
      />
      {showReflections && (
        <video
          key={`right-${videoKey}`}
          src="/video3.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-y-0 right-0 w-1/4 h-full object-cover opacity-30 blur-sm"
        />
      )}
    </div>
  );
};

type FormContentsProps = {
  isLoading: boolean;
  dialogOpen: boolean;
  data: any;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  register: UseFormRegister<RequestDiagnosis>;
  errors: FieldErrors<RequestDiagnosis>;
  handleSubmit: UseFormHandleSubmit<RequestDiagnosis>;
  onSubmit: SubmitHandler<RequestDiagnosis>;
};

const FormContents: React.FC<FormContentsProps> = ({
  isLoading,
  dialogOpen,
  data,
  setDialogOpen,
  register,
  errors,
  handleSubmit,
  onSubmit,
}) => (
  <div className="w-full max-w-full sm:max-w-xs md:max-w-md flex flex-col items-start gap-4 pt-6 lg:pt-0">
    <Typography
      variant="h5"
      sx={{
        fontWeight: 700,
        color: "#111",
        textAlign: "center",
        fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
        width: "100%",
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
        className="w-full py-2 text-sm sm:py-3 sm:text-base md:py-4 md:text-lg"
      />
    </form>

    {dialogOpen && <DialogMedical open onClose={() => setDialogOpen(false)} data={data} />}
  </div>
);

const LoginView: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [formOpen, setFormOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoKey, setVideoKey] = useState(0);

  const { isLoading, mutate, data, isSuccess } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestDiagnosis>({ defaultValues: { name: "", email: "" } });
  const [dialogOpen, setDialogOpen] = useState(false);

  const registered = useRegistrationStore((s) => s.registered);
  const setRegistered = useRegistrationStore((s) => s.setRegistered);
  const { getSuccess } = useNotification();

  useEffect(() => {
    if (isSuccess && data) {
      setRegistered(true);
      getSuccess("¡Registro exitoso!");
      setFormOpen(false);
      setVideoKey((k) => k + 1);
    }
  }, [isSuccess, data, setRegistered, getSuccess]);

  const onSubmit: SubmitHandler<RequestDiagnosis> = (formData) => {
    const data: request = {
      email: formData.email,
      name: formData.name,
      confirm_attendance: false
    }
    mutate(data);
  }

  const openForm = () => {
    setIsMuted(false);
    setFormOpen(true);
    setVideoKey((k) => k + 1);
  };

  const showReflections = isDesktop || formOpen;
  const mobileVideoHeight = formOpen ? "h-[45vh]" : "h-screen";

  const CongratsButton = (
    <button
      className="fixed bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-2xl z-30"
      onClick={() =>
        confetti({
          particleCount: 100,
          spread: 160,
          startVelocity: 30,
          colors: ["#f72585", "#7209b7"],
        })
      }
    >
      🎉
    </button>
  );

  // **Post-registro**: en móvil sin reflejos, en desktop con reflejos.
  if (registered) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-white">
        <div className={`relative w-full ${mobileVideoHeight}`}>
          <LoopingVideo
            muted={false}
            showReflections={isDesktop}
            videoKey={videoKey}
          />
        </div>
        {CongratsButton}
      </div>
    );
  }

  // **Desktop (antes de registrar)**
  if (isDesktop) {
    return (
      <div className="flex w-full h-screen">
        <div className="relative w-3/5 h-full">
          <LoopingVideo muted={isMuted} showReflections={true} videoKey={videoKey} />
        </div>
        <div className="w-2/5 h-full bg-white flex items-center justify-center px-8">
          <FormContents
            isLoading={isLoading}
            dialogOpen={dialogOpen}
            data={data}
            setDialogOpen={setDialogOpen}
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    );
  }

  // **Móvil sin formulario**
  if (!formOpen) {
    return (
      <div className={`relative w-full ${mobileVideoHeight}`}>
        <LoopingVideo muted={isMuted} showReflections={false} videoKey={videoKey} />
        <button
          onClick={openForm}
          className="absolute top-4 right-4 z-20 bg-white/90 text-black px-4 py-2 rounded-full shadow"
        >
          Me interesa 🔥
        </button>
      </div>
    );
  }

  // **Móvil con formulario abierto**
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-white">
      <div className={`relative w-full ${mobileVideoHeight}`}>
        <LoopingVideo muted={isMuted} showReflections={showReflections} videoKey={videoKey} />
      </div>
      <div className="w-full flex-1 bg-white overflow-auto p-4">
        <FormContents
          isLoading={isLoading}
          dialogOpen={dialogOpen}
          data={data}
          setDialogOpen={setDialogOpen}
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default LoginView;
