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

interface LoopingVideoProps {
  muted: boolean;
  showReflections: boolean;
  videoKey: number;
}

const LoopingVideo: React.FC<LoopingVideoProps> = ({ muted, showReflections, videoKey }) => (
  <div className="relative w-full h-full overflow-hidden bg-black">
    {/* Left reflection */}
    {showReflections && (
      <video
        src="/video3.mp4"
        autoPlay
        key={videoKey}
        loop
        muted
        playsInline
        className="absolute inset-y-0 left-0 w-1/4 h-full object-cover transform -scale-x-100 opacity-30 blur-sm"
      />
    )}

    {/* Central video: object-contain + object-top to avoid cropping */}
    <video
      src="/video2.mp4"
      autoPlay
      loop
      muted={muted}
      key={videoKey}
      playsInline
      className={
        showReflections
          ? "absolute inset-y-0 left-1/4 w-1/2 h-full object-contain object-top"
          : "absolute inset-0 w-full h-full object-contain object-top"
      }
    />

    {/* Right reflection */}
    {showReflections && (
      <video
        src="/video3.mp4"
        autoPlay
        loop
        key={videoKey}
        muted
        playsInline
        className="absolute inset-y-0 right-0 w-1/4 h-full object-cover opacity-30 blur-sm"
      />
    )}
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
  const [videoKey, setVideoKey] = useState(0);

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
  const openForm = () => {
    unmute();
    setFormOpen(true);
    setIsMuted(false);
    setVideoKey((k) => k + 1); // fuerza remount de LoopingVideo
    setFormOpen(true);
  };

  // showReflections in desktop or after opening form on mobile
  const showReflections = isDesktop || formOpen;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {isDesktop ? (
        <div className="flex w-full h-full">
          <div className="relative w-3/5 h-full">
            <LoopingVideo muted={isMuted} showReflections={true} videoKey={videoKey}/>
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
      ) : (
        <>
          {!formOpen && (
            <div className="relative w-full h-screen">
              <LoopingVideo muted={isMuted} showReflections={false} videoKey={videoKey}/>
              <button
                onClick={openForm}
                className="absolute top-4 right-4 z-20 bg-white/90 text-black px-4 py-2 rounded-full shadow"
              >
                Me interesa 🔥
              </button>
            </div>
          )}

          {formOpen && (
            <>
              <div className="absolute inset-0 w-full h-screen">
                <LoopingVideo muted={isMuted} showReflections={showReflections} videoKey={videoKey}/>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-white px-4 sm:px-6 md:px-8 h-[55vh] flex items-start p-10 justify-center transition-transform duration-500 ease-out">
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
            </>
          )}
        </>
      )}
    </div>
  );
};

export default LoginView;
