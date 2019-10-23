import React from "react";
import { LocalizedText } from "../LocalizedText/LocalizedText";

export const Disclaimer = () => (
  <p
    style={{
      fontSize: "12px",
      color: "rgba(255,255,255,.6)",
      margin: "48px 0 12px 0",
      textAlign: "center",
    }}
  >
    <LocalizedText id="disclaimer" />
  </p>
);
