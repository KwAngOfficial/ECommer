import Link from "next/link";
import { signUp } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Đăng ký</CardTitle>
        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}
      </CardHeader>
      <CardContent>
        <form action={signUp} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Họ tên</Label>
            <Input id="full_name" name="full_name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" name="password" type="password" minLength={6} required />
          </div>
          <Button type="submit" className="w-full">Đăng ký</Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
