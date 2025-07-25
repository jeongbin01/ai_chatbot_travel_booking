// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "./AuthContext";

function getCookie(name) {
  const raw = Cookies.get(name);
  if (!raw) return null;
  return decodeURIComponent(raw.replace(/\+/g, " "));
}


function AuthProvider({ children }) {
  const getInitialAuth = () => {
    const username = getCookie("username");
    const token = getCookie("jwtToken");
    const nickname = getCookie("nickname");

    if (username && token) {
      if (nickname) {
        return { username, nickname, token };
      } else {
        return { username, token };
      }
    }
    return null;
  };

  const [auth, setAuth] = useState(getInitialAuth());

  useEffect(() => {
    const interval = setInterval(() => {
      const usernameCookie = getCookie("username");
      const jwtToken = getCookie("jwtToken");
      const nicknameCookie = getCookie("nickname");

      if (usernameCookie && jwtToken) {
        const updatedAuth = nicknameCookie
          ? { username: usernameCookie, nickname: nicknameCookie, token: jwtToken }
          : { username: usernameCookie, token: jwtToken };

        if (
          !auth ||
          auth.username !== updatedAuth.username ||
          auth.token !== updatedAuth.token ||
          auth.nickname !== updatedAuth.nickname
        ) {
          setAuth(updatedAuth);
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
