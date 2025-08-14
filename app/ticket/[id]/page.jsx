async function getTicket(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${id}`, { cache: "no-store" });
  return res.json();
}

export default async function TicketPage({ params }) {
  const ticket = await getTicket(params.id);

  if (!ticket) {
    return <div className="p-4">❌ Ticket not found</div>;
  }
  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">🎟 Your Ticket</h1>
      <p><strong>Name:</strong> {ticket.first_name}</p>
      <p><strong>Mobile:</strong> {ticket.mobile}</p>
      <p><strong>Amount:</strong> {ticket.amount}</p>
      <p><strong>Charge ID:</strong> {ticket.charge_id}</p>
      <p><em>Keep this ticket safe.</em></p>
    </div>
  );
}
