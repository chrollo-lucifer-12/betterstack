import { User } from "@/lib/types"
import { axiosInstance } from "@repo/lib"
import { cookies } from "next/headers"
import { forbidden } from "next/navigation"
import UserDropdown from "./user-dropdown"

const FetchUser = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")

  if (!token) {
    forbidden()
  }

  const res = await axiosInstance.get(process.env.USER_ENDPOINT!, {
    headers: {
      cookie: cookieStore.toString(),
    },
  })

  const user = res.data.user as User

  return <UserDropdown user={user} />
}

export default FetchUser
