import { DashboardHeader } from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader heading="Dashboard" />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
