"use client"

import { TextFlippingBoard } from "../ui/text-flipping-board"
import React, { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"

const MESSAGES: string[] = [
  "99.999% UPTIME\nOR WE CRY\n- YOUR SERVER",
  "IS IT UP?\nOR IS IT JUST YOU?",
  "MONITOR EVERYTHING\nTRUST NOTHING",
  "DOWNTIME COSTS\nMORE THAN YOU THINK",
  "WE WATCH YOUR SERVERS\nSO YOU CAN SLEEP",
  "ALERTS BEFORE\nUSERS COMPLAIN",
  "YOUR API\nSHOULD NEVER BLINK",
  "UPTIME IS NOT A FEATURE\nIT'S A PROMISE",
  "STOP GUESSING\nSTART MONITORING",
  "IF IT GOES DOWN\nYOU'LL KNOW FIRST",
]

const MemoBoard = React.memo(TextFlippingBoard)

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-200" />,
})

const LandingPage = () => {
  const [msgIdx, setMsgIdx] = useState(0)

  const next = useCallback(
    () => setMsgIdx((i) => (i + 1) % MESSAGES.length),
    []
  )

  useEffect(() => {
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F2F0EF] p-4 md:p-6">
      <div className="flex justify-center">
        <h1 className="font-phenomena text-3xl md:text-4xl lg:text-5xl">
          Upwatch
        </h1>
      </div>
      <div
        className={`flex h-full w-full flex-col transition-all duration-700 ease-in-out lg:flex-row`}
      >
        <div className="flex h-full lg:w-1/2">
          <div className="flex w-full flex-col items-center justify-center gap-6 py-10 md:gap-8 md:py-20">
            <MemoBoard text={MESSAGES[msgIdx]} />
          </div>
        </div>

        <div className="h-[300px] w-full md:h-[400px] lg:h-auto lg:w-1/2">
          <Spline scene="https://prod.spline.design/URVl1PUsKQCcm0BH/scene.splinecode" />
        </div>
      </div>
    </div>
  )
}

export default LandingPage
