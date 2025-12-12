"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    params.delete("page"); // Reset to first page on new search
    router.push(`/shop?${params.toString()}`);
  }, 300);

  const onChange = useCallback(
    (term: string) => {
      setSearchQuery(term);
      handleSearch(term);
    },
    [handleSearch],
  );

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="search"
        placeholder="Search products..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
