import { c as useInternetIdentity, r as reactExports } from "./index-CstiQ4sz.js";
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
  const isVendorAuthenticated = () => Boolean(localStorage.getItem("vendorSessionToken"));
  const vendorLogout = () => {
    localStorage.removeItem("vendorSessionToken");
  };
  return {
    identity,
    loginStatus,
    isLoginSuccess,
    isAuthenticated,
    isLoading,
    principalText,
    login,
    logout: clear,
    isVendorAuthenticated,
    vendorLogout
  };
}
export {
  useAuth as u
};
