import { ScaleFade } from '@chakra-ui/react'
import { Models } from 'appwrite'
import React, { useEffect, useState } from 'react'
import { Route, Router, Switch, useLocation } from 'wouter'
import SidebarWithHeader from './components/SidebarWithHeader'
import About from './pages/About'
import Auth from './pages/auth/Auth'
import ForgotPassword from './pages/auth/ForgotPassword'
import Index from './pages/Index'
import Inventory from './pages/Inventory'
import LoadingPage from './pages/LoadingPage'
import NotFound from './pages/NotFound'
import EditProfile from './pages/profile/EditProfile'
import Settings from './pages/profile/Settings'
import Calendar from './pages/calendar/Calendar'
import Activity from './pages/calendar/Activity'
import Members from './pages/admin/Members'

export default function App() {
  // state
  const [loading, setLoading] = useState<boolean>(true)
  const [profile, setProfile] = useState<Models.Account<Models.Preferences>>()
  const [icon, setIcon]       = useState<URL>()

  // nav
  const [_, setLocation] = useLocation()


  useEffect(() => {
    const load = () => setTimeout(() => setLoading(false), 2000)

    window.account.get()
      .then(async () => {
        const profile = await window.account.get()

        const d = profile.prefs.defaultLocation

        setProfile(profile)
        setIcon(window.storage.getFilePreview(
          import.meta.env.VITE_APPWRITE_USER_ICON_BUCKET_ID,
          profile.prefs.icon,
        ))

        if (d && d !== '/') setLocation(d)
      })
      .then(load)
      .catch(() => {
        console.log('not logged in')
        setLocation('/auth')
        load()
      })
  }, [])

  const loadingPage = <LoadingPage />

  if (loading) return loadingPage

  return <Router>
    <ScaleFade initialScale={0.98} in={!loading}>
      <Switch>

        {/* Pre-auth routes */}
        <Route path="/auth/forgot-password"><ForgotPassword /></Route>
        <Route path="/auth"><Auth /></Route>

        <SidebarWithHeader profile={profile!} icon={icon!}>
          <Switch>
            {/* Kalender */}
            <Route path="/kalender/:id"> 
              {(params) => <Activity id={Number.parseInt(params.id)} />}
            </Route>
            <Route path="/kalender"> <Calendar /> </Route>

            <Route path="/instellingen"> <Settings /> </Route>
            <Route path="/voorraad"> <Inventory /> </Route>

            {/* Admin routes */}
            <Route path="/admin/members"> <Members /> </Route>
            {/* <Route path="/admin/"></Route> */}
            <Route path="/admin"> <NotFound /> </Route>

            {/* User profile */}
            <Route path="/profile"> <EditProfile /> </Route>
            <Route path="/about"> <About /> </Route>

            <Route path="/"> <Index /> </Route>        
            <Route path="/:rest*"> <NotFound /> </Route>
          </Switch>
        </SidebarWithHeader>
      </Switch>
    </ScaleFade>
  </Router>

}