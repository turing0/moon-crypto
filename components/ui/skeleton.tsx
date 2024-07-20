import { cn } from "@/lib/utils"


const TableSkeleton = () => (
  <div className="space-y-4">
    {/* Table header skeleton */}
    {/* <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-8 w-[200px]" />
    </div> */}
    
    {/* Table body skeleton */}
    <div className="border rounded-md">
      <div className="border-b bg-muted/50 p-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-6 w-full mr-4" />
          ))}
        </div>
      </div>
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="p-2 border-b last:border-0">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((col) => (
              <Skeleton key={col} className="h-6 w-full mr-4" />
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

export { Skeleton, TableSkeleton }
