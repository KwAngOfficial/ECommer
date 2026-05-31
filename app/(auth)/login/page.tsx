import Link from "next/link";
import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; redirect?: string; error?: string }>;
}) {
  const { registered, redirect, error } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Đăng nhập</CardTitle>
        {registered && (
          <p className="text-center text-sm text-green-600">
            Đăng ký thành công! Vui lòng đăng nhập.
          </p>
        )}
        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}
      </CardHeader>
      <CardContent>
        <form action={signIn} className="space-y-4">
          <input type="hidden" name="redirect" value={redirect || "/"} />
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">Đăng nhập</Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Đăng ký
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
