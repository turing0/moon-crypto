import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "./card";

const TableSkeleton = () => (
  <div className="space-y-2">
    {/* Table header skeleton */}
    {/* <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-8 w-[200px]" />
    </div> */}
    
    {/* Table body skeleton */}
    <div className="rounded-md border">
      <div className="border-b bg-muted/50 p-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="mr-4 h-6 w-full" />
          ))}
        </div>
      </div>
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="border-b p-2 last:border-0">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((col) => (
              <Skeleton key={col} className="mr-4 h-6 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Pagination skeleton */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-[100px]" />
      <Skeleton className="h-8 w-[200px]" />
    </div>
  </div>
)

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

const CardSkeleton = () => {
  return (
    <>
    <Card className="mb-8 w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-2 h-4 w-60" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="mb-2 h-4 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
          <div>
            <Skeleton className="mb-2 h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>

    <div className="space-y-4 py-2">
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-2 w-full" />
      {/* <Skeleton className="h-2 w-5/6 mx-auto" /> */}
      {/* <Skeleton className="h-2 w-4/6 mx-auto" /> */}
    </div>

    {/* <div className="space-y-4">
      <Skeleton className="h-1 w-full" />
      <Skeleton className="h-1 w-full" />
      <Skeleton className="h-1 w-full" />
    </div> */}
    </>

  );
};

export { Skeleton, TableSkeleton, CardSkeleton }
