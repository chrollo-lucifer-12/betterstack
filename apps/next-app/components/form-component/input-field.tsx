"use client"

import { AnimatePresence, motion } from "motion/react"
import { Field, FieldDescription } from "../ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group"
import { Icon } from "@phosphor-icons/react"
import { FC, HTMLInputTypeAttribute, useState } from "react"
import { cn } from "@/lib/utils"

interface InputFieldProps {
  name: string
  placeholder?: string
  inputGroupText: string
  icon: Icon
  type?: HTMLInputTypeAttribute
  fieldDescription?: string
  required?: boolean
  error?: string
}

const InputField: FC<InputFieldProps> = ({
  icon: Icon,
  inputGroupText,
  name,
  type,
  placeholder,
  fieldDescription,
  required = true,
  error,
}) => {
  const hasError = !!error
  const [hasValue, setHasValue] = useState(false)
  const align = !hasValue ? "block-start" : undefined

  return (
    <Field>
      <InputGroup
        className={cn(
          "h-auto transition-all duration-200",
          hasError
            ? "border-red-300 bg-red-50/40 ring-2 ring-red-200"
            : "border-input focus-within:ring-2 focus-within:ring-primary/30"
        )}
      >
        <InputGroupInput
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          required={required}
          className={cn(
            "bg-transparent",
            hasError && "placeholder:text-red-300"
          )}
        />

        <InputGroupAddon align={align}>
          <AnimatePresence mode="wait">
            {!hasValue ? (
              <motion.div
                key="label"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <InputGroupText
                  className={cn(
                    "transition-colors",
                    hasError && "text-red-500"
                  )}
                >
                  {inputGroupText}
                </InputGroupText>
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={cn("transition-colors", hasError && "text-red-500")}
              >
                <Icon size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </InputGroupAddon>
      </InputGroup>

      {fieldDescription && !hasError && (
        <FieldDescription>{fieldDescription}</FieldDescription>
      )}

      {hasError && (
        <FieldDescription className="font-medium text-red-500">
          {error}
        </FieldDescription>
      )}
    </Field>
  )
}
export default InputField
