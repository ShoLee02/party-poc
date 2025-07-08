import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, UseFormRegister, FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import confetti from "canvas-confetti";
import { Typography, TextField, useMediaQuery, useTheme } from "@mui/material";
import { RequestDiagnosis } from "../../../interfaces/auth/auth.interface";
import { useLogin } from "../../../queries/useAuth";
import ButtonUI from "../../../common/Button/ButtonUI";
import DialogMedical from "../../../common/Dialog/Dialog";

interface LoopingVideoProps {
  muted: boolean;
}

const LoopingVideo: React.FC<LoopingVideoProps> = ({ muted }) => (
  <div className="flex w-full h-full bg-black relative overflow-hidden">
    {/* Left reflection */}
    <video
      src="/video3.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="w-1/4 h-full object-cover transform -scale-x-100 opacity-30 blur-sm"
    />

    {/* Main video */}
    <video
      src="/video2.mp4"
      autoPlay
      loop
      muted={muted}
      playsInline
      className="w-1/2 h-full object-contain"
    />

    {/* Right reflection */}
    <video
      src="/video3.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="w-1/4 h-full object-cover opacity-30 blur-sm"
    />
  </div>
);

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

  const { isLoading, mutate, data, isSuccess } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestDiagnosis>({ defaultValues: { name: "", email: "" } });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (isSuccess) setDialogOpen(true);
  }, [isSuccess]);

  const onSubmit: SubmitHandler<RequestDiagnosis> = (formData) => {
    mutate(formData);
    confetti({
      particleCount: 100,
      spread: 160,
      startVelocity: 30,
      colors: ["#f72585", "#7209b7"],
    });
  };

  const unmute = () => setIsMuted(false);
  const handleButton = () => {
    unmute();
    setFormOpen(true);
  };

  // Video height: full screen normally, or 45vh after opening form on mobile
  const videoHeightClass = isDesktop
    ? "h-screen"
    : formOpen
    ? "h-[45vh]"
    : "h-screen";

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen overflow-x-hidden">
      {/* VIDEO + REFLECTIONS */}
      <div className={`w-full lg:w-3/5 relative ${videoHeightClass}`}>
        <LoopingVideo muted={isMuted} />
      </div>

      {/* DESKTOP: fixed form at right */}
      {isDesktop && (
        <div className="w-full lg:w-2/5 h-screen bg-white flex items-center justify-center px-8">
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
      )}

      {/* MOBILE: trigger button */}
      {!isDesktop && !formOpen && (
        <button
          onClick={handleButton}
          className="absolute top-4 right-4 z-20 bg-white/90 text-black px-4 py-2 rounded-full shadow"
        >
          Me interesa 🔥
        </button>
      )}

      {/* MOBILE: sliding form */}
      {!isDesktop && (
        <div
          className={`
            absolute inset-x-0 bottom-0 bg-white px-4 sm:px-6 md:px-8
            h-[55vh]
            transform ${formOpen ? "translate-y-0" : "translate-y-full"}
            transition-transform duration-500 ease-out
            flex items-center justify-center
          `}
        >
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
      )}
    </div>
  );
};

export default LoginView;
