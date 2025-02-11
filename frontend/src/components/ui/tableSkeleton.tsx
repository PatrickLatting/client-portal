import { cn } from "../../lib/utils"

interface TableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
  columns?: number
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
  ...props
}: TableSkeletonProps) {
  return (
    <div 
      className={cn("w-full border rounded-lg overflow-hidden", className)} 
      {...props}
    >
      <div className="border-b bg-gray-50">
        <div className="grid grid-cols-4 gap-4 p-4">
          {Array(columns).fill(null).map((_, index) => (
            <div 
              key={`header-${index}`} 
              className="animate-pulse rounded-md bg-primary/10 h-6" 
            />
          ))}
        </div>
      </div>

      <div className="bg-white">
        {Array(rows).fill(null).map((_, rowIndex) => (
          <div 
            key={`row-${rowIndex}`}
            className="grid grid-cols-4 gap-4 p-4 border-b last:border-0"
          >
            {Array(columns).fill(null).map((_, colIndex) => (
              <div 
                key={`cell-${rowIndex}-${colIndex}`}
                className="animate-pulse rounded-md bg-primary/10 h-4"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}