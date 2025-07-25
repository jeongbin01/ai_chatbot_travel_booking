// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {
  const getInitialAuth = () => {
    const usernameCookie = Cookies.get("username");
    const jwtToken = Cookies.get("jwtToken");
    if (usernameCookie && jwtToken) {
      return {
        username: decodeURIComponent(usernameCookie.replace(/\+/g, " ")),
        token: jwtToken,
      };
    }
    return null;
  };

  const [auth, setAuth] = useState(getInitialAuth());

  useEffect(() => {
    const interval = setInterval(() => {
      const usernameCookie = Cookies.get("username");

      const jwtToken = Cookies.get("jwtToken");
      if (usernameCookie && jwtToken) {
        const decodedUsername = decodeURIComponent(usernameCookie.replace(/\+/g, " "));
        if (!auth || auth.username !== decodedUsername) {
          setAuth({ username: decodedUsername, token: jwtToken });
        }
      } else if (auth !== null) {
        setAuth(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
