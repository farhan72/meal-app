"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({ placeholder = "Search for a meal...", className }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isFocused, setIsFocused] = useState(false);

  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentQuery = searchParams.get("q") || "";

      if ((query !== currentQuery) && (query?.length > 2 || query?.length === 0)) {
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
          params.set("q", query.trim());
        } else {
          params.delete("q");
        }

        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`);
        });
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query, searchParams, router, pathname]);

  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  return (
    <div 
      className={cn(
        "relative w-full transition-all duration-300 ease-in-out", 
        (isFocused || query) ? "lg:max-w-lg! xl:max-w-xl!" : "lg:max-w-md",
        className
      )}
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-border-soft bg-white pl-10 pr-10 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all shadow-sm text-primary placeholder:text-muted"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {isPending && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}
    </div>
  );
}
