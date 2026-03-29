"use client"

import { useState } from "react"
import Spline from "@splinetool/react-spline"

const LandingPage = () => {
  const [loadedCount, setLoadedCount] = useState(0)

  const handleLoad = () => {
    setLoadedCount((prev) => prev + 1)
  }

  const isLoading = loadedCount < 2

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F2F0EF]">
      <div
        className={`flex h-full w-full transition-all duration-700 ease-in-out ${
          isLoading
            ? "scale-105 opacity-0 blur-sm"
            : "blur-0 scale-100 opacity-100"
        }`}
      >
        <div className="h-full w-1/2">
          <Spline
            scene="https://prod.spline.design/MS8m0LWO4Dj6JoaY/scene.splinecode"
            onLoad={handleLoad}
          />
        </div>

        <div className="h-full w-1/2">
          <Spline
            scene="https://prod.spline.design/URVl1PUsKQCcm0BH/scene.splinecode"
            onLoad={handleLoad}
          />
        </div>
      </div>

      <div
        className={`absolute inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700 ${
          isLoading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    </div>
  )
}

export default LandingPage
