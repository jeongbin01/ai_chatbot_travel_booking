import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { HttpHeadersContext } from "./HttpHeadersContext";


function getDecodedCookie(name) {
  const raw = Cookies.get(name);
  if (!raw) return null;
  return decodeURIComponent(raw.replace(/\+/g, " "));
}

function HttpHeadersProvider({ children }) {
  const getInitialHeaders = () => {
    const jwtToken = getDecodedCookie("jwtToken");
    if (jwtToken) {
      return { Authorization: `Bearer ${jwtToken}` };
    }
    return {};
  };

  const [headers, setHeaders] = useState(getInitialHeaders());

  useEffect(() => {
    const interval = setInterval(() => {
      const jwtToken = getDecodedCookie("jwtToken");
      if (jwtToken && headers.Authorization !== `Bearer ${jwtToken}`) {
        setHeaders({ Authorization: `Bearer ${jwtToken}` });
      } else if (!jwtToken && headers.Authorization) {
        setHeaders({});
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [headers]);

  const value = { headers, setHeaders };

  return (
    <HttpHeadersContext.Provider value={value}>
      {children}
    </HttpHeadersContext.Provider>
  );
}

export default HttpHeadersProvider;
