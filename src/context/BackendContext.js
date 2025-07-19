import React, { createContext, useContext } from "react";

// Update based on environment
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

const BackendContext = createContext(BASE_URL);

export const useBackend = () => useContext(BackendContext);

export const BackendProvider = ({ children }) => {
  return (
    <BackendContext.Provider value={BASE_URL}>
      {children}
    </BackendContext.Provider>
  );
};
