"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import CryptoJS from "crypto-js";

export default function TicketClient({ chargeId: paramChargeId }) {
  const searchParams = useSearchParams();
  // Corrected: Use a single variable declaration for chargeId
  const chargeId = paramChargeId || searchParams?.get("charge_id");

  const [ticket, setTicket] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Exit if there is no chargeId
    if (!chargeId) {
      setIsLoading(false);
      return;
    }

    async function fetchTicket() {
      try {
        const res = await fetch(
          `https://salimafoodferstival.onrender.com/api/payments/ticket/${chargeId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch ticket");
        }

        const data = await res.json();

        const secret = process.env.NEXT_PUBLIC_TICKET_SECRET;

        // Corrected: Add a check for the secret key
        if (!secret) {
          console.error("Ticket secret key is not configured.");
          setIsValid(false);
          setTicket(data);
          return;
        }

        const expectedSignature = CryptoJS.HmacSHA256(
          data.ticket_id,
          secret
        ).toString(CryptoJS.enc.Hex);

        const isSignatureValid = expectedSignature === data.signature;
        setIsValid(isSignatureValid);
        setTicket(data);
      } catch (err) {
        console.error(err);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTicket();
  }, [chargeId]);

  if (isLoading) return <p>Loading ticket...</p>;
  if (!chargeId) return <p>No ticket ID provided.</p>;
  if (!ticket || !isValid) return <p>❌ Ticket is invalid or tampered!</p>;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">🎟 Your Ticket</h1>
      <div className="border rounded-xl p-6 shadow-lg bg-white">
        <p>
          <strong>Name:</strong> {ticket.first_name}
        </p>
        <p>
          <strong>Mobile:</strong> {ticket.mobile}
        </p>
        <p>
          <strong>Amount:</strong> {ticket.amount.$numberInt} MWK
        </p>
        <p>
          <strong>Event:</strong> {ticket.event}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(ticket.date.$date.$numberLong).toLocaleString()}
        </p>

        <div className="mt-6">
          <QRCode
            value={JSON.stringify({
              id: ticket.ticket_id,
              sig: ticket.signature,
            })}
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