import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import React from "react";

type ThemeProp = {
    children: JSX.Element
}

// enum themePalette {
//     BG= "#12181b",
//     PRIMARY= "#007098",
//     WHITE= "#FFFFFF",
//     FRONT_GLOBAL=  "'Open Sans'",
//     //Aler styles
//     ERROR_MAIN= "#F44336",
//     BG_ERROR_MAIN= "rgba(244, 67, 54, 0.1)",
//     SUCCESS_MAIN= "#4CAF50",
//     BG_SUCCESS_MAIN= "rgba(76, 175, 80, 0.1)",
//     WARNING_MAIN= "#FF9800",
//     BG_WARNING_MAIN= "rgba(255, 152, 0, 0.1)",
// }

const theme = createTheme({
  palette: {
    background: { default: "#0d0d0d" },
    primary: { main: "#80CFD5" },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 16,
    allVariants: { color: "#f5f5f5" },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          fontWeight: 600,
          textShadow: '0 0 8px rgba(255, 255, 255, 0.2)',
        },
        h4: {
          fontSize: '2rem',
          fontWeight: 700,
          textAlign: 'center',
          textShadow: '0 0 12px rgba(255, 255, 255, 0.5)',
        },
      },
    },

    // ~~ Aquí movemos los estilos del fieldset y del input ~~ 
     MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(4px)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#80CFD5",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#80CFD5",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#80CFD5",
          },
        },
        input: {
          color: "#111",
          padding: "18px 14px 14px", // espacio superior extra para la etiqueta
          "&::placeholder": {
            color: "#888",
            opacity: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#555",
          // posición inicial: 18px abajo de arriba, 14px a la derecha
          transform: "translate(14px, 18px) scale(1)",
          // cuando flota:
          "&.MuiInputLabel-shrink": {
            transform: "translate(14px, -6px) scale(0.75)",
          },
          "&.Mui-focused": {
            color: "#80CFD5",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #f72585, #7209b7)',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '2rem',
          padding: '12px 32px',
          fontSize: '1rem',
          boxShadow: '0 0 18px rgba(247, 37, 133, 0.4)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            background: 'linear-gradient(90deg, #7209b7, #f72585)',
            transform: 'scale(1.05)',
            boxShadow: '0 0 22px rgba(114, 9, 183, 0.6)',
          },
        },
      },
    },

    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: '1rem',
        },
      },
    },
  },
});

export const ThemeConfig: React.FC<ThemeProp> = ({children}) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    )
};