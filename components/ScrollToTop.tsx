"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToTop } from "@/lib/utils";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    scrollToTop(false);
  }, [pathname]);

  return null;
}
