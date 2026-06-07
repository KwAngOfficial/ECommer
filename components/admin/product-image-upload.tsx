"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ProductImageUploadProps {
  productId: string;
}

export function ProductImageUpload({ productId }: ProductImageUploadProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Vui lòng chọn ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("file", file);

    setLoading(true);
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

      setSuccess("Upload ảnh thành công!");
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch {
      setError("Lỗi mạng. Thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border bg-slate-50 p-4">
      <Label htmlFor="file">Upload ảnh mới</Label>
      <input
        ref={inputRef}
        id="file"
        name="file"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
      />
      <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, GIF — tối đa 5MB</p>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {success && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
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
