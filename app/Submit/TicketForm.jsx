"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TicketForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    mobile: "",
    amount: 6000,
    mobile_money_operator_ref_id: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Initialize payment
      const res = await fetch("https://salimafoodferstival.onrender.com/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!data.success) throw new Error("Payment init failed");

      const tx_ref = data.data.tx_ref;

      // Poll until payment is complete
      const pollPayment = async () => {
        const statusRes = await fetch(`https://salimafoodferstival.onrender.com/api/payments/status/${tx_ref}`);
        const statusData = await statusRes.json();
        if (statusData.status === "paid") router.push(`/payment-success?tx_ref=${tx_ref}`);
        else if (statusData.status === "failed") router.push(`/payment-failed?tx_ref=${tx_ref}`);
        else setTimeout(pollPayment, 3000);
      };

      pollPayment();
    } catch (err) {
      console.error(err);
      alert("Error initiating payment");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={form.first_name}
        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        required
      />
      <input
        placeholder="Mobile"
        value={form.mobile}
        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        required
      />
      <select
        value={form.mobile_money_operator_ref_id}
        onChange={(e) => setForm({ ...form, mobile_money_operator_ref_id: e.target.value })}
        required
      >
        <option value="">Select Operator</option>
        <option value="27494cb5-ba9e-437f-a114-4e7a7686bcca">TNM Mpamba</option>
      </select>
      <button type="submit" disabled={isLoading}>{isLoading ? "Processing..." : "Pay 6000 MK"}</button>
    </form>
  );
}
