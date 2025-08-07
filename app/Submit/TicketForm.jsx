"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TicketForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [form, setForm] = useState({
    mobile: "",
    operator: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Replace with real operator IDs from PayChangu
  const operators = [
    { name: "Airtel Money", ref: "airtel" },
    { name: "TNM Mpamba", ref: "tnm" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://salimafoodferstival.onrender.com/payments/initialize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            mobile: form.mobile,
            mobile_money_operator_ref_id: form.operator,
            amount: 2000, // fixed ticket price
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
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-sm mx-auto bg-white shadow rounded py-10"
    >
      {/* Name */}
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 font-semibold">
          Name:
        </label>
        <input
          type="text"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

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
