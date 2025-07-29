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
    const userId = getCookie("userId")

    if (username && token) {
      if (nickname) {
        return { username, nickname, token, userId };
      } else {
        return { username, token, userId };
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
      const userId = getCookie("userId");
      if (usernameCookie && jwtToken) {
        const updatedAuth = nicknameCookie
          ? { username: usernameCookie, nickname: nicknameCookie, token: jwtToken, userID: userId }
          : { username: usernameCookie, token: jwtToken, userId: userId };

        if (
          !auth ||
          auth.username !== updatedAuth.username ||
          auth.token !== updatedAuth.token ||
          auth.nickname !== updatedAuth.nickname ||
          auth.userId !== updatedAuth.userId
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
