import { cn } from "cn"

function Label({
  className,
  children,
  ...props
}) {
  return (
    <label
      className={cn("block text-sm font-medium text-slate-700 mb-1", className)}
      {...props}
    >
      {children}
    </label>
  )
}

export { Label }