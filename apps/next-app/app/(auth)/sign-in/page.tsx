"use client"

import { signin } from "@/actions/auth"
import FormComponent from "@/components/form-component"
import InputField from "@/components/form-component/input-field"
import { EnvelopeIcon, PasswordIcon } from "@phosphor-icons/react"
import { useActionState } from "react"

const Signin = () => {
  const [state, action, isPending] = useActionState(signin, undefined)

  return (
    <FormComponent
      title="Signin to your account"
      description=""
      buttonText="Signin"
      footer={
        <>
          Don`&apos;`t have an account? <a href="/sign-up">Sign up</a>
        </>
      }
      action={action}
      isPending={isPending}
    >
      <InputField
        icon={EnvelopeIcon}
        inputGroupText="Email"
        name="email"
        placeholder="m@example.com"
        type="email"
        fieldDescription=" "
        error={state?.errors?.email?.[0] ?? ""}
      />
      <InputField
        icon={PasswordIcon}
        inputGroupText="Password"
        name="password"
        fieldDescription=""
        placeholder=""
        type="password"
        error={state?.errors?.password?.[0]}
      />
    </FormComponent>
  )
}

export default Signin
