import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMemo } from "react";

export function useAuth() {
  const { identity, loginStatus, isLoginSuccess, login, clear } =
    useInternetIdentity();

  // User is authenticated when identity exists (loaded from storage OR after successful login)
  const isAuthenticated = Boolean(identity);
  const isLoading = loginStatus === "initializing";

  const principalText = useMemo(() => {
    if (!identity) return null;
    try {
      return identity.getPrincipal().toText();
    } catch {
      return null;
    }
  }, [identity]);

  return {
    identity,
    loginStatus,
    isLoginSuccess,
    isAuthenticated,
    isLoading,
    principalText,
    login,
    logout: clear,
  };
}
