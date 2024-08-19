import { Icons } from "@/components/shared/icons";
import { Skeleton } from "@/components/ui/skeleton";

export default function CTMLoading() {
  return (
    <>
      <div 
        className="mb-2 flex cursor-pointer items-center text-sm text-gray-600 dark:text-gray-400"
      >
        <Icons.arrowLeft className="mr-1 h-4 w-4" />
        <span>Copy Trading</span>
      </div>
      <div className="divide-border-200 divide-y rounded-md border">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </>
  );
}
