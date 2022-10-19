import { useEffect, useState } from 'react'
import AccessForbidden from '../pages/AccessForbidden'
import LoadingPage from '../pages/LoadingPage'
import { getRoles, Roles } from '../utils/user'

export interface ProtectedRouteProps {
  element: React.ReactNode
  allowedRoles: Roles[]
  currentRoles: Roles[]
}

export function ProtectedRoute(props: ProtectedRouteProps) {
  const [allowed, setAllowed] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const a = props.currentRoles.filter(value => props.allowedRoles.includes(value))
    setAllowed(a.length > 0)
  }, [])

  if (!allowed) {
    return <AccessForbidden roles={props.allowedRoles} />
  }
  
  return <>
    {props.element}
  </>
}