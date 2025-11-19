import * as React from "react"

type ToastActionElement = React.ReactElement<any>

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  action?: ToastActionElement
}

const toastListeners = new Set<(toast: ToastProps) => void>()

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  React.useEffect(() => {
    const listener = (toast: ToastProps) => {
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.slice(1))
      }, 3000)
    }

    toastListeners.add(listener)
    return () => {
      toastListeners.delete(listener)
    }
  }, [])

  const toast = React.useCallback((props: ToastProps) => {
    toastListeners.forEach((listener) => listener(props))
  }, [])

  return { toast, toasts }
}
