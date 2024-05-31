import { createContext, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import HttpRequestPrivate from "../../helpers/private-client";
import ServiceConfig from "../../helpers/service-endpoint";
import { useLocation } from "react-router-dom";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage("_theme", "light");
  const handleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  return (
    <ThemeContext.Provider value={{ setTheme, theme, handleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
