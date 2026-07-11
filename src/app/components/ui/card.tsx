import * as React from "react"

import { cn } from "@/lib/utils"
import { useSpotlight } from "@/app/hooks/useSpotlight"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Opt in to a cursor-following spotlight glow (see .spotlight in index.css). */
  spotlight?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, spotlight = false, onPointerMove, ...props }, ref) => {
    const handleSpotlight = useSpotlight<HTMLDivElement>(onPointerMove)
    return (
      <div
        ref={ref}
        onPointerMove={spotlight ? handleSpotlight : onPointerMove}
        className={cn(
          "panel-highlight rounded-xl border border-border bg-card text-card-foreground shadow-card dark:border-border/10 dark:bg-card/50 dark:shadow-none",
          spotlight && "spotlight relative isolate",
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-medium leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground/70", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
