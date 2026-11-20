import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [lawyer, setLawyer] = useState(() => JSON.parse(localStorage.getItem('lawyer') || 'null'));

  const saveLogin = ({ token, lawyer }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('lawyer', JSON.stringify(lawyer));
    setLawyer(lawyer);
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lawyer');
    setLawyer(null);
  };

  return <AuthContext.Provider value={{ lawyer, saveLogin, logout }}>{children}</AuthContext.Provider>;
}
