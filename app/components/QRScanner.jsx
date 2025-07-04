'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScanner() {
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [scanned, setScanned] = useState('');
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    const scannerId = "reader";
    const html5QrCode = new Html5Qrcode(scannerId);
    html5QrCodeRef.current = html5QrCode;

    Html5Qrcode.getCameras().then((devices) => {
      if (devices.length) {
        html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            if (decodedText === scanned) return;
            setScanned(decodedText);
            const ticketId = decodedText.split('/').pop();

            try {
              const res = await fetch(`http://localhost:5000/scan/${ticketId}`, {
                method: 'POST',
              });
              const data = await res.json();
              if (data.success) {
                setTicket(data.ticket);
                setError('');
              } else {
                setError(data.message);
                setTicket(null);
              }
              await html5QrCode.stop();
            } catch (err) {
              console.error(err);
              setError('❌ Failed to validate ticket.');
              await html5QrCode.stop();
            }
          },
          (err) => {
            console.warn('QR Scan error', err);
          }
        );
      } else {
        setError('No cameras found');
      }
    });

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  return (
    <div>
      <div id="reader" className="w-full max-w-md mx-auto mb-4" ref={scannerRef}></div>

      {ticket && (
        <div className="p-4 bg-green-100 border rounded shadow">
          <h2 className="font-bold text-lg">✅ Ticket Valid</h2>
          <p><strong>Name:</strong> {ticket.name}</p>
          <p><strong>Scanned:</strong> {ticket.scanned ? 'Yes' : 'No'}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border rounded text-red-800 shadow">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
