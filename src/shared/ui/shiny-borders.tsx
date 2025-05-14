export function ShinyBorder() {
  return (
    <>
      {/* Horizontal Borders (Top & Bottom) */}
      <span className="hidden dark:inline absolute top-0 left-0 right-0 h-[.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <span className="hidden dark:inline absolute bottom-0 left-0 right-0 h-[.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Vertical Borders (Left & Right) */}
      <span className="hidden dark:inline absolute top-0 bottom-0 left-0 w-[.5px] bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
      <span className="hidden dark:inline absolute top-0 bottom-0 right-0 w-[.5px] bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
    </>
  )
}
