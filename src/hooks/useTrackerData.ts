import { useQuery } from "@tanstack/react-query";
import { tarkovClient } from "@/api/client";
import { TRACKER_QUERY } from "@/api/queries";
import type { TrackerData } from "@/lib/types";

const ONE_HOUR = 1000 * 60 * 60;

export function useTrackerData() {
  return useQuery<TrackerData>({
    queryKey: ["tracker-data"],
    queryFn: () => tarkovClient.request<TrackerData>(TRACKER_QUERY),
    staleTime: ONE_HOUR,
    gcTime: ONE_HOUR * 24 * 7,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
  });
}
