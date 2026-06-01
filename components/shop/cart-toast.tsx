"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export function CartToast() {
  const message = useCartStore((s) => s.toastMessage);
  const clearToast = useCartStore((s) => s.clearToast);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(clearToast, 3200);
    return () => clearTimeout(t);
  }, [message, clearToast]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-[100] flex max-w-sm items-start gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-xl animate-in slide-in-from-bottom-4"
    >
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      <p className="flex-1 text-sm font-medium text-slate-800">{message}</p>
      <button
        type="button"
        onClick={clearToast}
        className="text-slate-400 hover:text-slate-600"
        aria-label="Đóng"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
