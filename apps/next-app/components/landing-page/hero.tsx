"use client"

import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "../ui/button"
import Link from "next/link"

import { useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

function scramble(el: HTMLElement, finalText: string, duration = 3000) {
  let iteration = 0
  const length = finalText.length

  const interval = setInterval(() => {
    const newText = finalText
      .split("")
      .map((char, i) => {
        if (i < iteration) return finalText[i]
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      })
      .join("")

    el.innerText = newText

    if (iteration >= length) {
      clearInterval(interval)
    }

    iteration += length / (duration / 30)
  }, 30)
}

const Hero = () => {
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const pRef = useRef<HTMLParagraphElement>(null)

  useGSAP(() => {
    const h1 = h1Ref.current!
    const p = pRef.current!

    const originalH1 = h1.innerText
    const originalP = p.innerText

    gsap.set([h1, p], { opacity: 0, y: 40 })

    const tl = gsap.timeline()

    tl.to(h1, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      onStart: () => scramble(h1, originalH1, 1000),
    }).to(
      p,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        onStart: () => scramble(p, originalP, 800),
      },
      "-=0.4"
    )
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        src="/bg.png"
        alt="background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <nav className="relative z-10 flex justify-between px-10 py-10">
        <Link href={"/"}>
          <h4 className="font-phenomena text-2xl text-white">upwatch</h4>
        </Link>
        <div className="gap-2">
          <Button>Login</Button>
          <Button variant={"ghost"} className={"text-white"}>
            Signup
          </Button>
        </div>
      </nav>

      <div className="relative z-10 flex h-full w-full items-center px-10">
        <div className="max-w-4xl">
          <h1
            ref={h1Ref}
            className="text-6xl leading-tight font-bold text-white md:text-7xl"
          >
            Monitor your uptime
            {"\n"}
            before users notice
          </h1>

          <p
            ref={pRef}
            className="mt-6 max-w-xl text-lg whitespace-pre-line text-gray-300"
          >
            Get real-time alerts, track performance, and ensure your services
            stay online 24/7. We detect downtime before it impacts your users.
          </p>

          <div className="mt-8 flex items-center gap-6">
            <Button variant={"outline"}>
              <ArrowRightIcon />
              Try for free
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
