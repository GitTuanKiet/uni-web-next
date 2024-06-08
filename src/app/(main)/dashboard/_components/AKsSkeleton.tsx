import { ApiKeyCardSkeleton } from "./AKCardSkeleton";
import { LIMITED_API_KEY } from "@/lib/constants";

export function ApiKeysSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: LIMITED_API_KEY }).map((_, i) => (
        <ApiKeyCardSkeleton key={i} />
      ))}
    </div>
  );
}
