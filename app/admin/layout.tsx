import { AdminSidebar } from "@/components/admin/sidebar";
import { dynamic } from "@/lib/supabase/route-config";

export { dynamic };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
