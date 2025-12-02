import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-0",
  {
    variants: {
      variant: {
        default:
          "bg-secondary-bg text-reverse-fg border-2 border-t-2 border-x-2 border-b-[3px] border-black hover:bg-secondary-bg/90",
        destructive:
          "bg-red-500 text-reverse-fg border-2 border-t-2 border-x-2 border-b-[3px] border-black hover:bg-red-500/90",
        outline:
          "bg-white text-primary-fg border-2 border-t-2 border-x-2 border-b-[3px] border-black hover:bg-gray-50",
        secondary:
          "bg-secondary-bg text-primary-fg border-2 border-t-2 border-x-2 border-b-[3px] border-black hover:bg-secondary-bg/80",
        ghost:
          "hover:bg-hover-bg hover:text-primary-fg",
        link: "text-primary-fg underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 py-1.5",
        lg: "h-10 px-6 py-2.5",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
