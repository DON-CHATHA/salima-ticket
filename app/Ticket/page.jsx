"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { QRCode } from "qrcode.react";

export default function TicketPage() {
  const params = useParams(); // for dynamic route /payment/[chargeId]
  const searchParams = useSearchParams(); // for query ?charge_id=CHG-123

  // Prefer dynamic route first, fallback to query string
  const chargeId = params?.chargeId || searchParams?.get("charge_id");

  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (!chargeId) return;

    async function fetchTicket() {
      try {
        const res = await fetch(
          `https://salimafoodferstival.onrender.com/api/payments/ticket/${chargeId}`
        );

        if (!res.ok) {
          console.error("Ticket fetch failed:", res.statusText);
          return;
        }

        const data = await res.json();
        setTicket(data);
      } catch (err) {
        console.error("Error fetching ticket:", err);
      }
    }

    fetchTicket();
  }, [chargeId]);

  if (!chargeId) return <p>No ticket ID provided in URL.</p>;
  if (!ticket) return <p>Loading ticket...</p>;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">🎟 Your Ticket</h1>
      <div className="border rounded-xl p-6 shadow-lg bg-white">
        <p><strong>Name:</strong> {ticket.name}</p>
        <p><strong>Mobile:</strong> {ticket.mobile}</p>
        <p><strong>Amount:</strong> {ticket.amount} MWK</p>
        <p><strong>Event:</strong> {ticket.event}</p>
        <p><strong>Date:</strong> {ticket.date}</p>

        <div className="mt-6">
          <QRCode
            value={JSON.stringify(ticket)}
            size={180}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        </div>
      </div>
    </div>
  );
}
