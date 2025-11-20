'use client'

import { Button } from '@/components/ui/button'

export function SkipToMain() {
  const handleSkip = () => {
    const main = document.getElementById('main-content')
    if (main) {
      main.focus()
      main.scrollIntoView()
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50"
      onClick={handleSkip}
    >
      Skip to main content
    </Button>
  )
}