import { cn } from "cn"

function Select({
  className,
  children,
  ...props
}) {
  return (
    <select
      className={cn(
        "w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-[#0B1F3A]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

function SelectTrigger({
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        "w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-[#0B1F3A] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function SelectContent({
  className,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        "absolute z-50 w-full max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function SelectItem({
  className,
  value,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        "px-3 py-2 hover:bg-slate-100 cursor-pointer",
        className
      )}
      data-value={value}
      {...props}
    >
      {children}
    </div>
  )
}

function SelectValue({
  className,
  placeholder,
  children,
  ...props
}) {
  return (
    <span className={cn("text-slate-700", className)} {...props}>
      {children || placeholder}
    </span>
  )
}

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }