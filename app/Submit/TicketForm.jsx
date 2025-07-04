'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TicketForm() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('https://salimafoodferstival.onrender.com/', {  // <- updated URL here
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    const data = await res.json();

    if (data.success) {
      router.push(`/ticket/${data.ticketId}`);
    } else {
      alert(data.message || '❌ Failed to create ticket');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto bg-white shadow rounded">
      <label htmlFor="name" className="block mb-1 font-semibold">Name:</label>
      <input
        type="text"
        id="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1 w-full mb-4"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Get Ticket
      </button>
    </form>
  );
}
