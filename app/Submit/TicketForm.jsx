"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TicketForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    mobile: "",
    amount: 50,
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

      if (!data.success) {
        throw new Error("Payment init failed");
      }

      // 🔹 CORRECTED: Use charge_id instead of tx_ref for polling
      const charge_id = data.charge_id;

      // Poll until payment is complete
      const pollPayment = async () => {
        // 🔹 CORRECTED: Use charge_id in the status check URL
        const statusRes = await fetch(`https://salimafoodferstival.onrender.com/api/payments/status/${charge_id}`);
        const statusData = await statusRes.json();
        
        if (statusData.status === "success") {
          router.push(`/payment-success?charge_id=${charge_id}`);
        } else if (statusData.status === "failed") {
          router.push(`/payment-failed?charge_id=${charge_id}`);
        } else {
          // 🔹 Continue polling every 3 seconds
          setTimeout(pollPayment, 2000);
        }
      };

      pollPayment();
    } catch (err) {
      console.error(err);
      // 🔹 Use a custom modal or message box instead of alert()
      // You can implement a simple state variable for this.
      alert("Error initiating payment"); 
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl space-y-4 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">🎟️ Buy Ticket</h2>
      <p className="text-sm text-center text-gray-500">Fill your details to complete payment</p>

      <input
        type="text"
        name="first_name"
        placeholder="Full Name"
        value={form.first_name}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
      />

      <input
        type="tel"
        name="mobile"
        placeholder="Mobile Number"
        value={form.mobile}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
      />

      <select
        name="mobile_money_operator_ref_id"
        value={form.mobile_money_operator_ref_id}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
      >
        <option value="">Select Operator</option>
        <option value="27494cb5-ba9e-437f-a114-4e7a7686bcca">TNM Mpamba</option>
        <option value="cf9cd692-63b7-4aa4-83c0-f4b38f0bb4c7">Airtel Money</option>
      </select>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-200 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Pay 50 MK"}
      </button>

      <p className="text-xs text-gray-400 text-center">Payments are securely processed via PayChangu</p>
    </form>
  );
}
