"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// This is the component that uses the client-side hooks.
function PaymentStatusContent() {
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
      <h1 className="text-red-600 text-2xl font-bold">❌ Payment Failed</h1>
      <p>Transaction Ref: {tx_ref}</p>
      <p>Status: {status}</p>
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-6 px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}

// This is the main page component that wraps the content in a Suspense boundary.
export default function FailedPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading payment status...</div>}>
        <PaymentStatusContent />
      </Suspense>
    </main>
  );
}