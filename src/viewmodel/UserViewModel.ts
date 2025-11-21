 import { useState } from "react";
import { UserService } from "../domain/service/UserService";

export const useUserViewModel = (onNavigate: (path: string) => void) => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({}); // Errores de campo

  const handleDeleteAccount = async () => {
    setLoading(true);
    setMessage("");
    setErrors({});

    const userService = UserService.getInstance();
    if (!userService || typeof userService.deleteUser !== "function") {
      setMessage("Servicio de usuario no disponible");
      return;
    }

    setLoading(true);
    try {
      await userService.deleteUser(email);
      setMessage("Cuenta eliminada con éxito.");
      onNavigate("/signup");
    } catch (error) {
      const err = error as Error;
      const msg = err?.message ?? "Error al eliminar la cuenta";
      setMessage("Error: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    loading,
    errors,
    
    setMessage,
    handleDeleteAccount,
    setLoading,
  };
};
 
 
 
 