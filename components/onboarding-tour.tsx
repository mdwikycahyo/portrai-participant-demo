"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type Step = {
  id: string
  title: string
  body: string
  selector?: string | null
  onEnter?: () => void
}

type OnboardingContextType = {
  isRunning: boolean
  stepIndex: number
  steps: Step[]
  startHomeTour: () => void
  next: () => void
  prev: () => void
  stop: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

function useBoundingRect(selector?: string | null) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    let raf = 0
    let ro: ResizeObserver | null = null
    const onScroll = () => {
      if (!selector) return
      const el = document.querySelector(selector) as HTMLElement | null
      if (el) setRect(el.getBoundingClientRect())
    }
    const onResize = onScroll

    const find = () => {
      if (!selector) return
      const el = document.querySelector(selector) as HTMLElement | null
      if (!el) {
        raf = requestAnimationFrame(find)
        return
      }
      setRect(el.getBoundingClientRect())
      try {
        ro = new ResizeObserver(() => {
          setRect(el.getBoundingClientRect())
        })
        ro.observe(el)
      } catch {}
      window.addEventListener("scroll", onScroll, true)
      window.addEventListener("resize", onResize)
      // Ensure visible
      el.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" })
    }
    find()
    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (ro) ro.disconnect()
      window.removeEventListener("scroll", onScroll, true)
      window.removeEventListener("resize", onResize)
    }
  }, [selector])

  return rect
}

function OverlayHighlight({ rect }: { rect: DOMRect | null }) {
  if (typeof document === "undefined") return null
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[80]">
      {/* Dim background */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Highlight box */}
      {rect && (
        <div
          aria-hidden
          className="absolute rounded-lg ring-2 ring-blue-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          }}
        />
      )}
    </div>,
    document.body
  )
}

function StepCard({ rect, step, onNext, onPrev, onClose, isFirst, isLast }: {
  rect: DOMRect | null
  step: Step
  onNext: () => void
  onPrev: () => void
  onClose: () => void
  isFirst: boolean
  isLast: boolean
}) {
  if (typeof document === "undefined") return null
  const position: React.CSSProperties = rect
    ? {
        position: "fixed",
        top: Math.max(16, Math.min(window.innerHeight - 200, rect.bottom + 12)),
        left: Math.min(rect.left, Math.max(16, window.innerWidth - 360 - 16)),
      }
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-start justify-start">
      <div
        role="dialog"
        aria-labelledby={`tour-title-${step.id}`}
        className="pointer-events-auto rounded-lg bg-white shadow-xl border w-[360px] p-4"
        style={position}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id={`tour-title-${step.id}`} className="text-base font-semibold text-gray-900">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{step.body}</p>
          </div>
          <button aria-label="Tutup" className="text-gray-400 hover:text-gray-600" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onPrev} disabled={isFirst}>
            Sebelumnya
          </Button>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={isLast ? onClose : onNext}>
              {isLast ? "Selesai" : "Lanjut"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export function OnboardingTourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isRunning, setIsRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [steps, setSteps] = useState<Step[]>([])
  const pendingStartRef = useRef<null | "home">(null)

  const homeSteps: Step[] = [
    {
      id: "welcome",
      title: "Selamat datang",
      body: "Tur singkat ini akan memperkenalkan Beranda, Navigasi, dan Pusat Notifikasi.",
    },
    {
      id: "navigation",
      title: "Navigasi",
      body: "Gunakan menu di sebelah kiri untuk berpindah ke Messenger, Email, Call, dan Documents.",
      selector: '[data-onboarding="nav:sidebar"]',
    },
    {
      id: "notification-center",
      title: "Pusat Notifikasi",
      body: "Pantau pengingat, tugas, dan update penting. Klik \"Lihat\" untuk membuka detail.",
      selector: '[data-onboarding="home:notification-center"]',
    },
  ]

  // Small helpers for DOM interactions during tour steps
  const waitForSelector = async (selector: string, timeoutMs = 5000) => {
    const start = Date.now()
    return new Promise<HTMLElement | null>((resolve) => {
      const tick = () => {
        const el = document.querySelector(selector) as HTMLElement | null
        if (el) return resolve(el)
        if (Date.now() - start > timeoutMs) return resolve(null)
        requestAnimationFrame(tick)
      }
      tick()
    })
  }

  const clickFirstChannel = async () => {
    const first = (document.querySelector('[data-onboarding="messenger:channel-item"]') as HTMLElement | null)
      || (document.querySelector('[data-onboarding="messenger:channel-list"] [data-onboarding="messenger:channel-item"]') as HTMLElement | null)
    if (first) first.click()
  }

  const clickParticipantByName = async (name: string) => {
    const sel = `[data-onboarding="messenger:participant-item"][data-name="${name}"]`
    let el = document.querySelector(sel) as HTMLElement | null
    if (!el) {
      // Wait briefly if panel still rendering
      el = (await waitForSelector(sel, 2000))
    }
    if (!el) {
      // Fallback: click the first participant (not "You")
      const first = document.querySelector('[data-onboarding="messenger:participant-item"]') as HTMLElement | null
      first?.click()
      return
    }
    el.click()
  }

  const messengerSteps: Step[] = [
    {
      id: "messenger-primer",
      title: "Messenger",
      body: "Tempat Anda berkomunikasi dengan tim: kanal, peserta, dan percakapan.",
    },
    {
      id: "messenger-channels",
      title: "Daftar Kanal",
      body: "Pilih percakapan untuk berpindah kanal dan melihat riwayat chat.",
      selector: '[data-onboarding="messenger:channel-list"]',
    },
    {
      id: "messenger-participants",
      title: "Peserta Percakapan",
      body: "Sorot percakapan per orang untuk fokus pada konteks yang relevan.",
      selector: '[data-onboarding="messenger:participant-selection"]',
      onEnter: () => {
        // Auto-select first channel to make participants meaningful
        setTimeout(() => {
          clickFirstChannel()
        }, 50)
      },
    },
    {
      id: "messenger-chat-pane",
      title: "Area Chat",
      body: "Baca pesan, lihat penanda sistem, dan tombol aksi seperti panggilan.",
      selector: '[data-onboarding="messenger:chat-pane"]',
      onEnter: () => {
        // Select a specific participant (prefer Jessica) for a coherent transition
        setTimeout(() => {
          clickParticipantByName("Jessica Wong")
        }, 150)
      },
    },
    {
      id: "messenger-composer",
      title: "Ketik & Kirim",
      body: "Tulis pesan Anda di sini lalu tekan Enter atau tombol kirim.",
      selector: '[data-onboarding="messenger:composer"]',
    },
  ]

  const emailSteps: Step[] = [
    {
      id: "email-primer",
      title: "Kelola email Anda",
      body: "Baca, balas, dan kelola email masuk serta draft.",
    },
    {
      id: "email-tabs",
      title: "Navigasi Folder",
      body: "Beralih antara Inbox dan Draft untuk fokus pekerjaan Anda.",
      selector: '[data-onboarding="email:sidebar-tabs"]',
      onEnter: () => {
        // Pastikan tab Inbox aktif
        const inboxBtn = document.querySelector('[data-onboarding="email:tab"][data-id="inbox"]') as HTMLElement | null
        inboxBtn?.click()
      },
    },
    {
      id: "email-list",
      title: "Buka Email",
      body: "Pilih email untuk melihat detail, lampiran, dan waktu.",
      selector: '[data-onboarding="email:list"]',
    },
    {
      id: "email-content",
      title: "Baca & Balas",
      body: "Tinjau isi, unduh lampiran, dan balas langsung dari panel ini.",
      selector: '[data-onboarding="email:content"]',
      onEnter: async () => {
        // Klik email pertama bila belum ada yang dipilih
        const selected = document.querySelector('[data-onboarding="email:item"].border-l-blue-500')
        if (!selected) {
          const firstItem = document.querySelector('[data-onboarding="email:item"]') as HTMLElement | null
          firstItem?.click()
        }
      },
    },
  ]

  const callSteps: Step[] = [
    {
      id: "call-primer",
      title: "Riwayat panggilan",
      body: "Di sini Anda melihat daftar panggilan beserta durasi dan waktu.",
      selector: '[data-onboarding="call:history"]',
    },
  ]

  const documentsSteps: Step[] = [
    {
      id: "documents-primer",
      title: "Kelola dokumen",
      body: "Jelajahi folder, lihat file, dan buat dokumen baru.",
    },
    {
      id: "documents-folders",
      title: "Folder",
      body: "Buka kumpulan dokumen berdasarkan kategori atau tim.",
      selector: '[data-onboarding="documents:folders"]',
    },
    {
      id: "documents-files",
      title: "Semua File",
      body: "Lihat daftar file, pemilik, dan lokasi folder.",
      selector: '[data-onboarding="documents:files"]',
    },
    {
      id: "documents-create",
      title: "Buat Dokumen",
      body: "Klik tombol ini untuk membuat dokumen baru di editor.",
      selector: '[data-onboarding="documents:create"]',
    },
  ]

  const startHomeTour = useCallback(() => {
    pendingStartRef.current = "home"
    // Always navigate to home before starting
    if (pathname !== "/home") router.push("/home")
    else {
      // If already on /home, start immediately
      setSteps(homeSteps)
      setStepIndex(0)
      setIsRunning(true)
    }
  }, [pathname, router])

  // Start when we land on /home after a push
  useEffect(() => {
    if (pendingStartRef.current === "home" && pathname === "/home") {
      pendingStartRef.current = null
      setSteps(homeSteps)
      setStepIndex(0)
      setIsRunning(true)
    }
  }, [pathname])

  // If user advances at the end of Home, navigate to Messenger and continue there
  useEffect(() => {
    if (!isRunning) return
    // When on /home and beyond last step (defensive), push to /messenger
    if (pathname === "/home" && stepIndex >= steps.length - 1) {
      // no-op here; handoff happens in next()
    }
  }, [isRunning, pathname, stepIndex, steps.length])

  const next = useCallback(() => {
    // If we are at last step on Home, navigate and switch to Messenger steps
    const atLast = stepIndex === steps.length - 1
    if (pathname === "/home" && atLast) {
      router.push("/messenger")
      // Wait for route change, then load messenger steps
      const id = setInterval(() => {
        if (window.location.pathname === "/messenger") {
          clearInterval(id)
          setSteps(messengerSteps)
          setStepIndex(0)
        }
      }, 50)
      return
    }
    // If we are at last step on Messenger, navigate to Email and continue
    if (pathname === "/messenger" && atLast) {
      router.push("/email")
      const id = setInterval(() => {
        if (window.location.pathname === "/email") {
          clearInterval(id)
          setSteps(emailSteps)
          setStepIndex(0)
        }
      }, 50)
      return
    }
    // If we are at last step on Email, navigate to Call and continue
    if (pathname === "/email" && atLast) {
      router.push("/call")
      const id = setInterval(() => {
        if (window.location.pathname === "/call") {
          clearInterval(id)
          setSteps(callSteps)
          setStepIndex(0)
        }
      }, 50)
      return
    }
    // If we are at last step on Call, navigate to Documents and continue
    if (pathname === "/call" && atLast) {
      router.push("/documents")
      const id = setInterval(() => {
        if (window.location.pathname === "/documents") {
          clearInterval(id)
          setSteps(documentsSteps)
          setStepIndex(0)
        }
      }, 50)
      return
    }
    setStepIndex((i) => Math.min(steps.length - 1, i + 1))
  }, [pathname, router, stepIndex, steps.length])

  const prev = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1))
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    setSteps([])
    setStepIndex(0)
  }, [])

  const value = useMemo(
    () => ({ isRunning, stepIndex, steps, startHomeTour, next, prev, stop }),
    [isRunning, stepIndex, steps, startHomeTour, next, prev, stop]
  )

  const current = isRunning ? steps[stepIndex] : undefined
  const rect = useBoundingRect(current?.selector)
  const isFirstStepOnPage = isRunning && stepIndex === 0

  // Run step-specific side effects when step changes
  useEffect(() => {
    if (!current || !isRunning) return
    current.onEnter?.()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, isRunning])

  // Also add a visible blue ring directly on the target element for extra clarity
  const lastElRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    // Clean up previous
    if (lastElRef.current) {
      lastElRef.current.classList.remove("ring-2", "ring-blue-400", "rounded-lg", "relative", "z-[81]")
      lastElRef.current = null
    }
    if (!isRunning || !current?.selector) return
    // For the first step on each page, keep the card centered and avoid adding ring
    if (stepIndex === 0) return
    if (current.id === "navigation") return

    let raf = 0
    const find = () => {
      const el = document.querySelector(current.selector!) as HTMLElement | null
      if (!el) {
        raf = requestAnimationFrame(find)
        return
      }
      el.classList.add("ring-2", "ring-blue-400", "rounded-lg", "relative", "z-[81]")
      lastElRef.current = el
    }
    find()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (lastElRef.current) {
        lastElRef.current.classList.remove("ring-2", "ring-blue-400", "rounded-lg", "relative", "z-[81]")
        lastElRef.current = null
      }
    }
  }, [isRunning, current?.selector, current?.id, stepIndex])

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      {isRunning && current && (
        <>
          <OverlayHighlight rect={isFirstStepOnPage ? null : rect} />
          {(() => {
            const isLastStep = stepIndex === steps.length - 1
            // Only treat as final when we are on Documents page's last step
            const treatAsLast = pathname === "/documents" && isLastStep
            return (
              <StepCard
                rect={isFirstStepOnPage ? null : rect}
                step={current}
                onNext={next}
                onPrev={prev}
                onClose={stop}
                isFirst={stepIndex === 0}
                isLast={treatAsLast}
              />
            )
          })()}
        </>
      )}
    </OnboardingContext.Provider>
  )
}

export function useOnboardingTour() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error("useOnboardingTour must be used within OnboardingTourProvider")
  return ctx
}
