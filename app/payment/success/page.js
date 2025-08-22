"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function PaymentStatusContent() {
  const params = useSearchParams();
  const charge_id = params.get("charge_id"); // updated
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    if (charge_id) {
      fetch(`https://salimafoodferstival.onrender.com/api/payments/status/${charge_id}`)
        .then(res => res.json())
        .then(data => setStatus(data.status))
        .catch(() => setStatus("error"));
    }
  }, [charge_id]);

  if (!charge_id) {
    return <p>No transaction reference provided.</p>;
  }

  return (
    <div className="text-center mt-12">
      <h1 className="text-green-600 text-2xl font-bold">✅ Payment Successful</h1>
      <p>Thank you for your payment!</p>
      <p>Transaction Ref: {charge_id}</p>
      <p>Status: {status}</p>
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-6 px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading payment confirmation...</div>}>
        <PaymentStatusContent />
      </Suspense>
    </main>
  );
}
