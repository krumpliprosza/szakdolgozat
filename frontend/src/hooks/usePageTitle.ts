import { useEffect } from 'react'

// Leiras: Beallitja az oldal cimet a megadott szoveg alapjan, oldalvaltaskor.

const SITE_TITLE = ""

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title}${SITE_TITLE}` : SITE_TITLE
  }, [title])
}