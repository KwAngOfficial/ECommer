"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold">Đã xảy ra lỗi</h1>
      <p className="max-w-md text-muted-foreground text-sm">
        {error.message || "Vui lòng thử lại sau."}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">Mã lỗi: {error.digest}</p>
      )}
      <Button onClick={reset}>Thử lại</Button>
    </div>
  );
}
