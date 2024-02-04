import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: [
      "Montserrat",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1280,
      xl: 1920,
    },
  },

  // palette: {
  //   primary: {
  //     main: '#4683d9'
  //   }
  // },

  // components: {
  //   MuiButton: {
  //     variants: [
  //       {
  //         props: { variant: 'primary' },
  //         style: {
  //           width: '170px',
  //           height: '40px',
  //           fontWeight: 'normal',
  //           fontSize: '1rem',
  //           textTransform: 'none',
  //           backgroundColor: 'var(--gold-color)',
  //           borderRadius: '4px',
  //           transition: '.2s ease',
  //           '&:hover': {
  //             boxShadow: '0px 6px 10px rgba(141, 114, 19, 0.15)',
  //             backgroundColor: 'var(--gold-color)',
  //           },
  //         }
  //       }
  //     ]
  //   },
  // }
});
