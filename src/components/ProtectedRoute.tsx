import { useEffect, useState } from 'react'
import AccessForbidden from '../pages/AccessForbidden'
import LoadingPage from '../pages/LoadingPage'
import { Committee, CommitteeName } from '../types/users'

export interface ProtectedRouteProps {
  element: React.ReactNode
  allowed: CommitteeName[]
  current: Committee[]
}

export function ProtectedRoute(props: ProtectedRouteProps) {
  const [allowed, setAllowed] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const allAllowed = [CommitteeName.Admins, CommitteeName.Senaat, ...props.allowed]
    const currentNames = props.current.map(a => a.name)
    const a = allAllowed.filter(a => currentNames.includes(a))
    setAllowed(a.length > 0)
  }, [])

  if (!allowed) {
    return <AccessForbidden roles={props.allowed} />
  }
  
  return <>
    {props.element}
  </>
}