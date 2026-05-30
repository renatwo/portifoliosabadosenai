import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

/**
 * Hook customizado para gerenciar autenticação no Firebase e validação estrita de UID.
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // O UID administrativo permitido, configurado via variável de ambiente (.env)
  const allowedUid = import.meta.env.VITE_ALLOWED_UID;

  useEffect(() => {
    // Subscreve ao observador de estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setError(null);
      
      if (currentUser) {
        // Validação estrita do UID no lado do cliente
        if (currentUser.uid === allowedUid) {
          setUser(currentUser);
        } else {
          // Desloga imediatamente se o UID não corresponder
          try {
            await signOut(auth);
            setError("Acesso negado. Esta conta Google não possui privilégios de administrador.");
          } catch (err) {
            console.error("Erro ao deslogar usuário não autorizado:", err);
          }
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [allowedUid]);

  /**
   * Efetua o login via popup do Google (mais fácil para depurar erros de rede sem dar reload).
   */
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;
      
      if (loggedUser.uid !== allowedUid) {
        await signOut(auth);
        setError("Acesso negado. Esta conta Google não possui privilégios de administrador.");
        setUser(null);
        setLoading(false);
        return false;
      }
      
      setUser(loggedUser);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Erro no login com Google:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("O login foi cancelado antes de abrir o popup.");
      } else if (err.code === "auth/popup-blocked") {
        setError("O pop-up de login foi bloqueado pelo seu navegador. Por favor, libere pop-ups para este site.");
      } else {
        setError("Ocorreu um erro ao tentar autenticar. Tente novamente.");
      }
      setLoading(false);
      return false;
    }
  };

  /**
   * Efetua o logout da sessão do Firebase.
   */
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Erro ao deslogar:", err);
      setError("Erro ao tentar desconectar.");
    }
    setLoading(false);
  };

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
    setError
  };
};
