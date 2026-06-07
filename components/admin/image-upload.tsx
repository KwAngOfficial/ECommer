"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";

interface ImageUploadProps {
  productId: string;
}

export function ImageUpload({ productId }: ImageUploadProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("productId", productId);

    try {
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload thất bại");
        return;
      }

      setSuccess(true);
      form.reset();
      router.refresh();
    } catch {
      setError("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border bg-slate-50 p-4">
      <Label htmlFor="file">Upload ảnh mới</Label>
      <Input
        id="file"
        name="file"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        required
        disabled={loading}
      />
      <p className="text-xs text-muted-foreground">
        JPG, PNG, WebP, GIF — tối đa 10MB
      </p>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {success && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Upload thành công!
        </p>
      )}
      <Button type="submit" variant="outline" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang upload...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload ảnh
          </>
        )}
      </Button>
    </form>
  );
}
