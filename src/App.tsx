import { ScaleFade, useColorMode } from '@chakra-ui/react';
import { Models } from 'appwrite';
import React, { useEffect, useState } from 'react';
import { Route, Router, Switch, useLocation } from 'wouter';
import SidebarWithHeader from './components/SidebarWithHeader';
import About from './pages/About';
import Auth from './pages/auth/Auth';
import ForgotPassword from './pages/auth/ForgotPassword';
import CleaingSchedule from './pages/CleaningSchedule';
import Index from './pages/Index';
import LoadingPage from './pages/LoadingPage';
import NotFound from './pages/NotFound';
import EditProfile from './pages/profile/EditProfile';
import Settings from './pages/profile/Settings';
import { getUserPreferences, UserPreferences } from './utils/user';

type UIProps = {
  c: React.ReactNode
}

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
        setLocation('/auth')
        load()
      })
  }, [])

  const loadingPage = <LoadingPage />

  if (loading) return loadingPage

  return <Router base={import.meta.env.BASE_URL}>
    <ScaleFade initialScale={0.98} in={!loading}>
      <SidebarWithHeader profile={profile!} icon={icon!}>
        <Switch>
          {/* Normal Routes */}
          <Route path="/cleaning-schedule"> <CleaingSchedule /> </Route>
          <Route path="/settings"> <Settings /> </Route>

          {/* User profile */}
          <Route path="/profile"> <EditProfile /> </Route>
          <Route path="/about"> <About /> </Route>

          {/* Pre-auth routes */}
          <Route path="/auth/forgot-password"><ForgotPassword /></Route>
          <Route path="/auth"><Auth /></Route>

          <Route path="/"> <Index /> </Route>        
          <Route> <NotFound /> </Route>
        </Switch>
      </SidebarWithHeader>
    </ScaleFade>
  </Router>

}