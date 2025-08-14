
import { useEffect, useState } from "react";

export default function TicketPage({ searchParams }) {
  const [ticket, setTicket] = useState(null);
  const { charge_id } = searchParams; // From URL: ?charge_id=CHG-123456

  useEffect(() => {
    if (!charge_id) return;
    // Fetch ticket from backend
    fetch(`/api/tickets/${charge_id}`)
      .then(res => res.json())
      .then(data => setTicket(data.ticket))
      .catch(err => console.error(err));
  }, [charge_id]);

  if (!ticket) return <p>Loading your ticket...</p>;

  return (
    <div>
      <h1>🎫 Your Ticket</h1>
      <p>Name: {ticket.first_name}</p>
      <p>Mobile: {ticket.mobile}</p>
      <p>Amount Paid: {ticket.amount}</p>
      <p>QR Code: {ticket.qr_code}</p>
    </div>
  );
}

