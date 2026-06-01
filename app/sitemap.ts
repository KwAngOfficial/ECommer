import { MetadataRoute } from "next";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://localhost";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  if (!isSupabaseConfigured()) return staticPages;

  try {
    const { createPublicClient } = await import("@/lib/supabase/public");
    const supabase = createPublicClient();
    if (!supabase) return staticPages;
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true);

    const productUrls =
      products?.map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })) ?? [];

    return [...staticPages, ...productUrls];
  } catch {
    return staticPages;
  }
}
