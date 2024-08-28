import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader
        heading="Exchanges"
        // text="Create and manage exchange accounts."
      />
      <div className="divide-border-200 divide-y rounded-md border">
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    </>
  );
}
