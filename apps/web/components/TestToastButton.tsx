"use client";

import React from "react";
import { notify } from "@/lib/notify";

const TestToastButton = () => {
  return (
    <button
      onClick={() => notify.success("This is a success notification!")}
      style={{
        padding: "10px 20px",
        backgroundColor: "#22c55e",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 500,
      }}
    >
      Test Success Toast
    </button>
  );
};

export default React.memo(TestToastButton);
