"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TicketRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chargeId = searchParams?.get("charge_id");

  useEffect(() => {
    if (chargeId) {
      router.replace(`/Ticket/${chargeId}`);
    }
  }, [chargeId]);

  return <p>Redirecting to your ticket...</p>;
}
