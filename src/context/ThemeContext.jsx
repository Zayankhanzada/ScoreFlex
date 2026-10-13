import { createContext,useContext, useState } from "react";

const ThemeContext = createContext(null);

const lightTheme = {
  mode: "light",
  color: "#1E293B",
  backgroundColor: "#F8FAFC",
};

const darkTheme = {
  mode: "dark",
  color: "#F1F5F9",
  backgroundColor: "#353839",
};

export function ThemeProvider ({children}){
    const [theme,setTheme] = useState(lightTheme);
    const changeTheme = () => {
        setTheme ((prev)=> 
        prev.mode === "light" ? darkTheme: lightTheme);
    }
    return  (
        <ThemeContext.Provider value ={{theme, changeTheme}}>
            {children}
        </ThemeContext.Provider>
 
    );
}
 export function useTheme(){
    const context = useContext(ThemeContext);
    if (!context) {
        throw new error("useTheme must be inside ThemeProvider");        
    }
    return context;
 }