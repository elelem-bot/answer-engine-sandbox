import React, { createContext, useContext, useState } from "react";

const GuidanceContext = createContext({ guidanceMode: false, setGuidanceMode: () => {} });

export function GuidanceProvider({ children }) {
  const [guidanceMode, setGuidanceMode] = useState(false);
  return (
    <GuidanceContext.Provider value={{ guidanceMode, setGuidanceMode }}>
      {children}
    </GuidanceContext.Provider>
  );
}

export function useGuidance() {
  return useContext(GuidanceContext);
}