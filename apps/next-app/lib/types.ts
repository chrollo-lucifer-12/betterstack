import z from "zod"

export type SignupFormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type SigninFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type User = {
  email: string
  image: string
  name: string
}

export const signupSchema = z.object({
  name: z.string().min(3, { error: "Name must be atleast 3 characters long" }),
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "Password must be atleast 8 characters long" }),
})

export const signinSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "Password must be atleast 8 characters long" }),
})
