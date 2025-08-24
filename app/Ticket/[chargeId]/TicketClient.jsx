"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import CryptoJS from "crypto-js";

export default function TicketClient({ chargeId }) {
  const [ticket, setTicket] = useState(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!chargeId) return;

    async function fetchTicket() {
      try {
        const res = await fetch(
          `https://salimafoodferstival.onrender.com/api/payments/ticket/${chargeId}`
        );
        if (!res.ok) return;
        const data = await res.json();

        // Validate ticket signature
        const ticketData = { ticket_id: data.ticket_id, first_name: data.first_name };
        const secret = process.env.NEXT_PUBLIC_TICKET_SECRET;
        const expectedSignature = CryptoJS.HmacSHA256(ticketData.ticket_id, secret).toString(CryptoJS.enc.Hex);

        setIsValid(expectedSignature === data.signature);
        setTicket(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchTicket();
  }, [chargeId]);

  if (!chargeId) return <p>No ticket ID provided.</p>;
  if (!ticket) return <p>Loading ticket...</p>;
  if (!isValid) return <p>❌ Ticket is invalid or tampered!</p>;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">🎟 Your Ticket</h1>
      <div className="border rounded-xl p-6 shadow-lg bg-white">
        <p><strong>Name:</strong> {ticket.first_name}</p>
        <p><strong>Mobile:</strong> {ticket.mobile}</p>
        <p><strong>Amount:</strong> {ticket.amount} MWK</p>
        <p><strong>Event:</strong> {ticket.eventName}</p>
        <p><strong>Date:</strong> {ticket.eventDate}</p>

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
