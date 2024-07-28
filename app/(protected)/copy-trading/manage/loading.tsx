import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function CTMLoading() {
  return (
    // <DashboardShell>
    <>
      <DashboardHeader
        heading="Manage Copy-Trading"
        // text=""
      />
      <div className="divide-border-200 divide-y rounded-md border">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </>
  );
}
