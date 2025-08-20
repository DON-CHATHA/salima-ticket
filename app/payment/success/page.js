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

  if (!tx_ref) return <p>No transaction reference provided.</p>;

  return (
    <div className="text-center mt-12">
      <h1 className="text-green-600 text-2xl font-bold">🎉 Payment Success</h1>
      <p>Transaction Ref: {tx_ref}</p>
      <p>Status: {status}</p>
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-6 px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Go Home
      </button>
    </div>
  );
}
