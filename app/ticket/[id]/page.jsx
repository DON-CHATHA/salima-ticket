'use client';

import { useEffect, useState } from 'react';

export default function TicketDetails({ params }) {
  const { id } = params;

  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`https://salimafoodferstival.onrender.com/ticket/${id}`)
      .then((res) => res.json())
      .then((data) => setTicket(data.ticket))
      .catch((err) => console.error('Error loading ticket:', err));
  }, [id]);

  if (!ticket) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border shadow rounded">
      <h1 className="text-xl font-bold mb-4">SALIMA FOOD FESTIVAL</h1>
      <p><strong>Name:</strong> {ticket.name}</p>
      <p><strong>Status:</strong> {ticket.scanned ? 'Scanned' : 'Valid'}</p>
      <img src={ticket.qrCodeBase64} alt="QR Code" className="mt-4 w-40" />
    </div>
  );
}
