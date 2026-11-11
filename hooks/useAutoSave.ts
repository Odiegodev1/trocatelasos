"use client"

import { useEffect, useRef } from "react"

interface UseAutoSaveProps<T> {
  data: T
  onSave: (data: T) => void | Promise<void>
  delay?: number
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 800,
}: UseAutoSaveProps<T>) {
  const firstRender = useRef(true)
  const onSaveRef = useRef(onSave)

  useEffect(() => {
    onSaveRef.current = onSave
  }, [onSave])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const timer = setTimeout(() => {
      void onSaveRef.current(data)
    }, delay)

    return () => clearTimeout(timer)
  }, [data, delay])
}