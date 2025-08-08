"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TicketForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    mobile: "",
    operator: "",
    amount: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // operator IDs from PayChangu
  const operators = [
    {
      name: "Airtel Money",
      ref: "20be6c20-adeb-4b5b-a7ba-0769820df4fb", // Airtel
    },
    {
      name: "TNM Mpamba",
      ref: "27494cb5-ba9e-437f-a114-4e7a7686bcca", // TNM
    },
  ];

  const handleChange = (e) => {
    // This will correctly handle both string and number inputs
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛠️ Add validation to check if mobile number and operator are selected
    if (!form.mobile || !form.operator) {
      alert("Please provide a mobile number and select an operator.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        "https://salimafoodferstival.onrender.com/api/payments/initialize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: form.mobile,
            mobile_money_operator_ref_id: form.operator,
            // Ensure the amount is parsed as a number if needed by the backend
            amount: parseInt(form.amount),
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        router.push(`/ticket/${data.tx_ref}`);
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
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-sm mx-auto bg-white shadow rounded py-10"
    >
      {/* Mobile Number */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Mobile Number</label>
        <input
          type="tel"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="e.g. 0888123456"
          className="w-full border rounded px-3 py-2 focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Amount</label>
        <input
          // 💡 Changed type from "" to "number" for better mobile experience
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="20000"
          className="w-full border rounded px-3 py-2 focus:outline-none"
          required
        />
      </div>

      {/* Operator */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Mobile Money Operator</label>
        <select
          name="operator"
          value={form.operator}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="" disabled>
            Select Operator
          </option>
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