import type { MetadataRoute } from "next";
import { ALLOW_INDEX } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: ALLOW_INDEX
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
  };
}
