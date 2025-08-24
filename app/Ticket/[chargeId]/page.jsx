// no "use client" here, this is a server component
import TicketClient from "./TicketClient";

export default function TicketPage({ params }) {
  return <TicketClient chargeId={params.chargeId} />;
}
