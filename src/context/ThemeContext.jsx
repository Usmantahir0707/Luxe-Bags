
import  { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {}
});


export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);


  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


export const useThemeContext = () => {
  const { setTheme } = useContext(ThemeContext);
  return setTheme;
};
