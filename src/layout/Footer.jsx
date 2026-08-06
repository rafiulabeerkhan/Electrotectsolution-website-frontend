import React from "react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <div className="flex items-center gap-2">
      <p className="mt-3 text-sm text-text-light dark:text-text ">
        Developed and maintained by:
      </p>
      <img src={logo} alt="Company Logo" className="h-8" />
    </div>
  );
};

export default Footer;