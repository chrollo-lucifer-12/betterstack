import { Suspense } from "react"
import { Spinner } from "../ui/spinner"
import FetchUser from "./fetch-user"

const UserComponent = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <FetchUser />
    </Suspense>
  )
}

export default UserComponent
