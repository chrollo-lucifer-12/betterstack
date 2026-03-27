"use client"

import { signup } from "@/actions/auth"
import FormComponent from "@/components/form-component"
import InputField from "@/components/form-component/input-field"
import { EnvelopeIcon, PasswordIcon, UserIcon } from "@phosphor-icons/react"
import { useActionState } from "react"

const SignupForm = () => {
  const [state, action, isPending] = useActionState(signup, undefined)

  return (
    <FormComponent
      title="Create your account"
      description="Fill in the form below to create your account"
      buttonText="Create Account"
      footer={
        <>
          Already have an account? <a href="/sign-in">Sign in</a>
        </>
      }
      action={action}
      isPending={isPending}
    >
      <InputField
        icon={UserIcon}
        inputGroupText="Name"
        name="name"
        placeholder="Enter your name"
        type="text"
        error={state?.errors?.name?.[0] ?? ""}
      />
      <InputField
        icon={EnvelopeIcon}
        inputGroupText="Email"
        name="email"
        placeholder="m@example.com"
        type="email"
        fieldDescription=" We'll use this to contact you. We will not share your email
          with anyone else."
        error={state?.errors?.email?.[0] ?? ""}
      />
      <InputField
        icon={PasswordIcon}
        inputGroupText="Password"
        name="password"
        fieldDescription="Must be at least 8 characters long."
        placeholder=""
        type="password"
        error={state?.errors?.password?.[0]}
      />
    </FormComponent>
  )
}

export default SignupForm
