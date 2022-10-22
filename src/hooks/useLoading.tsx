import { useState } from 'react'

export function useLoading(loadingTime = 500): [boolean, () => void] {
  const [loading, setLoading] = useState(true)

  const load = () => {
    setTimeout(() => setLoading(false), loadingTime)
  }

  return [ loading, load ]
}