"use server"

import {
  SigninFormState,
  signinSchema,
  SignupFormState,
  signupSchema,
} from "@/lib/types"
import { catchErrorTyped, axiosInstance } from "@repo/lib"
import { AxiosError } from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const signin = async (state: SigninFormState, formData: FormData) => {
  const { success, data, error } = signinSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!success) {
    return { errors: error.flatten().fieldErrors }
  }

  const [err, res] = await catchErrorTyped(
    (async () => {
      const response = await axiosInstance.post(
        process.env.SIGNIN_ENDPOINT!,
        data
      )
      const token = response.data.token
      if (!token) throw new Error("Something went wrong")

      const cookieStore = await cookies()
      cookieStore.set("token", token, {
        httpOnly: true,
        path: "/",
      })

      return response
    })()
  )

  axiosInstance.post(process.env.SIGNIN_ENDPOINT!, data)
  if (err) {
    const axiosErr = err as AxiosError<{ message?: string; cause?: string }>
    const status = axiosErr.response?.status?.toString() || ""
    const message = axiosErr.response?.data?.message || "Something went wrong"

    if (status.startsWith("5"))
      return {
        errors: {
          password: [message],
        },
      }

    return {
      errors: {
        email: [message],
      },
    }
  }

  const cookieStore = await cookies()
  cookieStore.set("token", res.data.token)

  redirect("/")
}

export const signup = async (
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> => {
  const { success, data, error } = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!success) {
    const errors = error.flatten().fieldErrors
    return { errors }
  }

  const [err] = await catchErrorTyped(
    axiosInstance.post(process.env.SIGNUP_ENDPOINT!, data)
  )

  if (err) {
    const axiosErr = err as AxiosError<{ message?: string; cause?: string }>
    const status = axiosErr.response?.status?.toString() || ""
    const message = axiosErr.response?.data?.message || "Something went wrong"

    if (status.startsWith("5"))
      return {
        errors: {
          password: [message],
        },
      }

    return {
      errors: {
        email: [message],
      },
    }
  }

  redirect("/sign-in")

  return { message: "Signup successful" }
}
