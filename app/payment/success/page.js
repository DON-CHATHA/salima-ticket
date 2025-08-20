"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const tx_ref = params.get("tx_ref");
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    if (tx_ref) {
      fetch(`https://salimafoodferstival.onrender.com/api/payments/status/${tx_ref}`)
        .then(res => res.json())
        .then(data => setStatus(data.status))
        .catch(() => setStatus("error"));
    }
  }, [tx_ref]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ color: "green" }}>🎉 Payment Success</h1>
      <p>Transaction Ref: {tx_ref}</p>
      <p>Status: {status}</p>
      <button
        onClick={() => (window.location.href = "/")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          border: "none",
          background: "green",
          color: "white",
          cursor: "pointer",
          borderRadius: "6px",
        }}
      >
        Go Home
      </button>
    </div>
  );
}
