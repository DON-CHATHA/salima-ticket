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
  const [statusMessage, setStatusMessage] = useState("");

  const operators = [
    { name: "Airtel Money", ref: "20be6c20-adeb-4b5b-a7ba-0769820df4fb" },
    { name: "TNM Mpamba", ref: "27494cb5-ba9e-437f-a114-4e7a7686bcca" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const pollPayment = (chargeId) => {
    let elapsed = 0;
    const interval = setInterval(async () => {
      elapsed += 5000;

      try {
        setStatusMessage("Checking payment status...");

        const res = await fetch(`https://salimafoodferstival.onrender.com/api/payments/verify/${chargeId}`);
        const data = await res.json();

        if (data.status === "success") {
          clearInterval(interval);
          setStatusMessage("Payment successful! Redirecting...");
          router.push(`/ticket/${data.data._id}`);
        } else {
          // You can handle pending or failed statuses here if you want
          console.log("Payment status:", data.status);
        }
      } catch (err) {
        console.error("❌ Polling error:", err);
        clearInterval(interval);
        setStatusMessage("Error checking payment status.");
      }

      // Stop polling after 2 minutes
      if (elapsed >= 120000) {
        clearInterval(interval);
        setStatusMessage("Payment verification timed out. Please check again later.");
      }
    }, 5000); // poll every 5 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.mobile || !form.operator) {
      alert("Please provide a mobile number and select an operator.");
      return;
    }

    setIsLoading(true);
    setStatusMessage("Initiating payment...");

    try {
      const res = await fetch(`https://salimafoodferstival.onrender.com/api/payments/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: form.mobile,
          mobile_money_operator_ref_id: form.operator,
          first_name: form.first_name,
          amount: parseInt(form.amount, 10),
        }),
      });

      const data = await res.json();

      if (data.success && data.charge_id) {
        setStatusMessage("Payment initiated. Waiting for confirmation...");
        pollPayment(data.charge_id);
      } else {
        alert(data.message || "❌ Failed to initiate payment");
        setStatusMessage("");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong. Please try again.");
      setStatusMessage("");
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
          placeholder="John Doe"
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
          min="1"
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

      {statusMessage && (
        <p className="mt-4 text-center text-gray-700">{statusMessage}</p>
      )}
    </form>
  );
}
