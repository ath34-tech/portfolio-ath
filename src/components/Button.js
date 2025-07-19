import React from "react";
import "./Button.css";

const Button = ({ children, ...rest }) => (
  <button className="pink-btn" {...rest}>{children}</button>
);

export default Button;
