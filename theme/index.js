// @mui
import { CssBaseline } from '@mui/material';
import {
  createTheme,
  ThemeProvider as MUIThemeProvider
} from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import breakpoints from './breakpoints';
import componentsOverride from './overrides';
//
import palette from './palette';
import shadows, { customShadows } from './shadows';
import typography from './typography';

// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default function ThemeProvider({ children }) {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isLight = false;

  const themeOptions = useMemo(
    () => ({
      palette: isLight ? palette.light : palette.dark,
      typography,
      breakpoints,
      shape: { borderRadius: 14 },
      shadows: isLight ? shadows.light : shadows.dark,
      customShadows: isLight ? customShadows.light : customShadows.dark
    }),
    [isLight]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
