import React from "react";

const Layout = ({ children }) => (
  <div style={{
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2rem 1rem",
    minHeight: "80vh"
  }}>
    {children}
  </div>
);

export default Layout;
