import createTheme from '@mui/material/styles/createTheme';

// cria uma estancia do tema claro
const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

// cria uma estancia do tema escuro 
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export { lightTheme, darkTheme };