"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function TicketContent() {
  const params = useSearchParams();
  const charge_id = params.get("charge_id");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ticketRef = useRef();

  useEffect(() => {
    if (charge_id) {
      fetch(`https://salimafoodferstival.onrender.com/api/tickets/${charge_id}`)
        .then(res => {
          if (!res.ok) throw new Error("Ticket not available or payment incomplete");
          return res.json();
        })
        .then(data => {
          setTicket(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError("No transaction reference provided");
      setLoading(false);
    }
  }, [charge_id]);

  const downloadPDF = async () => {
    if (!ticketRef.current) return;

    const canvas = await html2canvas(ticketRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ticket-${charge_id}.pdf`);
  };

  if (loading) return <p className="text-center mt-12">Loading ticket...</p>;
  if (error) return <p className="text-center mt-12 text-red-600">{error}</p>;

  return (
    <div className="flex flex-col items-center mt-10">
      <div
        ref={ticketRef}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl rounded-2xl p-6 w-[380px] border-4 border-white relative"
      >
        <h1 className="text-2xl font-bold mb-3 text-center">🎟 Event Ticket</h1>
        <div className="mb-4 text-center">
          <h2 className="text-xl font-semibold">{ticket.eventName}</h2>
          <p className="text-sm">{ticket.eventDate}</p>
        </div>
        <div className="mb-4">
          <p><strong>Name:</strong> {ticket.buyerName}</p>
          <p><strong>Charge ID:</strong> {ticket.charge_id}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Mobile:</strong> {ticket.mobile}</p>
        </div>
        <div className="mt-4 flex justify-center">
          <img src={ticket.qrCodeUrl} alt="QR Code" className="w-40 h-40 object-contain rounded-lg border-2 border-white" />
        </div>
        <p className="absolute bottom-3 left-0 right-0 text-center text-sm">Powered by CyberHats</p>
      </div>
      <button
        onClick={downloadPDF}
        className="mt-6 px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
      >
        Download Ticket PDF
      </button>
    </div>
  );
}

export default function TicketPage() {
  return (
    <main>
      <Suspense fallback={<div className="text-center mt-12">Loading ticket...</div>}>
        <TicketContent />
      </Suspense>
    </main>
  );
}
