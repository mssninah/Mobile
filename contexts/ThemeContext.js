import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

// Créer le contexte
const ThemeContext = createContext();

// Fournisseur du contexte
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(Appearance.getColorScheme() === 'dark'); // Initial mode based on system preference

  useEffect(() => {
    const colorSchemeListener = Appearance.addChangeListener(({ colorScheme }) => {
      setDarkMode(colorScheme === 'dark');
    });

    return () => colorSchemeListener.remove();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook pour utiliser le thème dans les composants
export const useTheme = () => useContext(ThemeContext);
