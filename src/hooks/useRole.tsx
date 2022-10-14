import { useEffect } from 'react'

enum Roles {
  Admin = 'admin',
  Senaat = 'senaat',
  Lid = 'lid',
  Aspirant = 'aspirant',
  NotLoaded = 'not-loaded'
}

let currentRole = Roles.NotLoaded

export default function useRole() {

  useEffect(() => {
    if (currentRole === Roles.NotLoaded) {
      window.account.get()
        .then(a => {
          a.
        })
    }
  }, [])
  
  return currentRole
}