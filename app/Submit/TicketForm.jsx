"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TicketForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    mobile: "",
    operator: "",
    amount: "",
    first_name: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const operators = [
    { name: "Airtel Money", ref: "20be6c20-adeb-4b5b-a7ba-0769820df4fb" },
    { name: "TNM Mpamba", ref: "27494cb5-ba9e-437f-a114-4e7a7686bcca" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const pollPayment = (chargeId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://salimafoodferstival.onrender.com/api/payments/verify/${chargeId}`);
        const data = await res.json();

        if (data.status === "success") {
          clearInterval(interval);
          router.push(`/ticket/${data.data._id}`); // redirect to ticket page
        }
      } catch (err) {
        console.error("❌ Polling error:", err);
      }
    }, 5000); // every 5 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.mobile || !form.operator) {
      alert("Please provide a mobile number and select an operator.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`https://salimafoodferstival.onrender.com/api/payments/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: form.mobile,
          mobile_money_operator_ref_id: form.operator,
          first_name: form.first_name,
          amount: parseInt(form.amount),
        }),
      });

      const data = await res.json();

      if (data.success && data.charge_id) {
        pollPayment(data.charge_id); // start polling with the valid charge_id
      } else {
        alert(data.message || "❌ Failed to initiate payment");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto bg-gray-100 shadow rounded py-10">
      <div className="mb-4">
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          type="text"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="john doe"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mobile Number</label>
        <input
          type="tel"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="0888123456"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="20000"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Mobile Money Operator</label>
        <select
          name="operator"
          value={form.operator}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="" disabled>Select Operator</option>
          {operators.map((op) => (
            <option key={op.ref} value={op.ref}>
              {op.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
