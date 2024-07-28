import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLoading() {
  return (
    <>
      <DashboardHeader
        heading="Exchanges"
        // text=""
      />
      <div className="divide-border-200 divide-y rounded-md border">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </>
  );
}
