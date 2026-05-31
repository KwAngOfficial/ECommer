export function SetupBanner({ message }: { message?: string }) {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
      {message ||
        "Database chưa sẵn sàng. Kiểm tra biến môi trường Supabase trên Vercel và chạy file migration SQL."}
    </div>
  );
}
