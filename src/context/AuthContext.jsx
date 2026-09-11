import { createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }

  let user = null;

  if (context.token ) {
    try {
      user = jwtDecode(context.token);
    } catch (error) {
      console.error("Erreur de décodage du token:", error);
    }
  }

  return {
    ...context,
    user,
  };
};