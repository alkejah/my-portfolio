"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()

  const [pending, setPending] = useState(false)

  async function handleLogout() {
    setPending(true)

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } finally {
      router.replace("/admin/login")
      router.refresh()
      setPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={handleLogout}
    >
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  )
}