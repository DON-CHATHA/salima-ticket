'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/QRScanner';

const STAFF_CODE = process.env.NEXT_PUBLIC_STAFF_CODE;

export default function ScanPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const savedCode = sessionStorage.getItem('staff_code');
    if (savedCode === STAFF_CODE) {
      setAuthorized(true);
      startTimeout();
    }
  }, []);

  const handleUnlock = () => {
    if (code === STAFF_CODE) {
      sessionStorage.setItem('staff_code', code);
      setAuthorized(true);
      startTimeout();
    } else {
      alert('Incorrect staff code');
    }
  };

  const startTimeout = () => {
    const timeout = setTimeout(() => {
      logout();
    }, 5 * 60 * 1000); // 5 minutes
    setTimer(timeout);
  };

  const logout = () => {
    clearTimeout(timer);
    sessionStorage.removeItem('staff_code');
    setAuthorized(false);
    router.push('/'); // Redirect to home or login page
  };

  if (!authorized) {
    return (
      <section className="p-6 max-w-sm mx-auto text-center">
        <h1 className="text-xl font-bold mb-4">🔐 Staff Only</h1>
        <input
          type="password"
          placeholder="Enter staff PIN"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-3"
        />
        <button onClick={handleUnlock} className="bg-blue-600 text-white px-4 py-2 rounded">
          Unlock
        </button>
      </section>
    );
  }

  return (
    <section className="p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">🎫 Staff QR Scanner</h1>
        <button onClick={logout} className="text-red-600 underline text-sm">Logout</button>
      </div>
      <QRScanner />
      <p className="mt-2 text-sm text-gray-500">This session will auto-logout in 5 minutes.</p>
    </section>
  );
}
