import { c as useInternetIdentity, r as reactExports } from "./index-CR5jwz_B.js";
function useAuth() {
  const { identity, loginStatus, isLoginSuccess, login, clear } = useInternetIdentity();
  const isAuthenticated = Boolean(identity);
  const isLoading = loginStatus === "initializing";
  const principalText = reactExports.useMemo(() => {
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
    logout: clear
  };
}
export {
  useAuth as u
};
