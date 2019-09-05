import React from "react";
import { LocalizedText } from "../LocalizedText/LocalizedText";

export const Disclaimer = () => (
  <p
    style={{
      fontSize: "12px",
      color: "rgba(255,255,255,.6)",
      margin: "48px 0 12px 0",
      textAlign: "center",
      textShadow:
        "2px 2px 0 #000, 0px 0 5px #000, 0px 0 5px #000, 0px 0 5px #000, 0px 0 5px #000"
    }}
  >
    <LocalizedText id="disclaimer" />
  </p>
);
