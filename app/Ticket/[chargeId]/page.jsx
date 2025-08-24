import { Suspense } from 'react';
import TicketClient from './TicketClient';

export default function TicketPage() {
  return (
    <Suspense fallback={<div>Loading ticket...</div>}>
      <TicketClient />
    </Suspense>
  );
}