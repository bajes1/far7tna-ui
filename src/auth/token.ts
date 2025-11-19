export const saveAuth = (token: string, userJson: string) => {
  localStorage.setItem("access_token", token);
  localStorage.setItem("user", userJson);
};
export const clearAuth = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};
export const getToken = () => localStorage.getItem("access_token");
export const getUser  = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};
export const getRole = () => getUser()?.role ?? null;
