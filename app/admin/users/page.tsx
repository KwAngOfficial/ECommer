import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Người dùng</h1>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Họ tên</th>
              <th className="p-3 text-left">SĐT</th>
              <th className="p-3 text-left">Vai trò</th>
              <th className="p-3 text-left">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.full_name || "—"}</td>
                <td className="p-3">{user.phone || "—"}</td>
                <td className="p-3">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Để nâng quyền admin: UPDATE profiles SET role = &apos;admin&apos; WHERE email = &apos;...&apos;
      </p>
    </div>
  );
}
