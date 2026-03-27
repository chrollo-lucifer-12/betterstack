import { cn } from "@/lib/utils"
import { FC, ReactNode } from "react"
import { Field, FieldDescription, FieldGroup } from "../ui/field"
import { Button } from "../ui/button"
import { Spinner } from "@/components/ui/spinner"

interface FormComponentProps {
  children: ReactNode
  title: string
  description?: string
  className?: React.ComponentProps<"form">
  buttonText?: string
  footer?: ReactNode
  isPending: boolean
  action: (payload: FormData) => void
}

const FormComponent: FC<FormComponentProps> = ({
  children,
  title,
  description,
  className,
  buttonText = "Submit",
  footer,
  isPending,
  action,
}) => {
  return (
    <form action={action} className={cn("flex flex-col gap-6", className)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-sm text-balance text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {children}
        <Field>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Submitting" : buttonText}
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>

        {footer && (
          <Field>
            <FieldDescription className="px-6 text-center">
              {footer}
            </FieldDescription>
          </Field>
        )}
      </FieldGroup>
    </form>
  )
}

export default FormComponent
