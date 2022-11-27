import { ScaleFade } from '@chakra-ui/react'
import { Models } from 'appwrite'
import React, { useEffect, useState } from 'react'
import { Route, Router, Switch, useLocation } from 'wouter'
import SidebarWithHeader from './components/SidebarWithHeader'
import About from './pages/About'
import Auth from './pages/auth/Auth'
import ForgotPassword from './pages/auth/ForgotPassword'
import Index from './pages/Index'
import Inventory from './pages/inventory/Inventory'
import LoadingPage from './pages/LoadingPage'
import NotFound from './pages/NotFound'
import EditProfile from './pages/profile/EditProfile'
import Settings from './pages/profile/Settings'
import Calendar from './pages/calendar/Calendar'
import Activity from './pages/calendar/Activity'
import Members from './pages/admin/Members'
import RolePage from './pages/admin/Roles'
import { ProtectedRoute } from './components/ProtectedRoute'
import { getRoles, Roles } from './utils/user'
import AllRoles from './pages/admin/AllRoles'
import AdminPage from './pages/admin/Admin'
import Statistics from './pages/inventory/Statistics'
import NewPurchase from './pages/inventory/NewPurchase'
import Purchases from './pages/inventory/Purchases'
import NewSale from './pages/inventory/NewSale'
import Sales from './pages/inventory/Sales'
import NewActivity from './pages/calendar/NewActivity'
import FinancialHome from './pages/financial/FinancialHome'
import SalesMutation from './pages/financial/SalesMutation'
import { checkToken, getToken, getUser } from './utils/backend'
import { User } from './types/users'

export default function App() {
  // state
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser]       = useState<User>()
  const [roles, setRoles]     = useState<Roles[]>()
  const [icon, setIcon]       = useState<string>()

  // nav
  const [_, setLocation] = useLocation()


  useEffect(() => {
    const load = () => setTimeout(() => setLoading(false), 2000)
    
    const token = getToken()

    if (!token) {
      console.log('Token nog found or not valid anymore')
      setLocation('/auth')
      setLoading(false)
      return
    }

    const user = getUser()
    setUser(user)

    setIcon(user?.profile_picture ?? './missing.jpg')
    setRoles([Roles.Admin])
    load()
  }, [])

  const loadingPage = <LoadingPage />

  if (loading) return loadingPage

  return <Router>
    <ScaleFade initialScale={0.98} in={!loading}>
      <Switch>

        {/* Pre-auth routes */}
        <Route path="/auth/forgot-password"><ForgotPassword /></Route>
        <Route path="/auth"><Auth /></Route>

        <SidebarWithHeader user={user!} icon={icon!} roles={roles!}>
          <Switch>
            {/* Kalender */}
            <Route path="/kalender/nieuw">
              <NewActivity />
            </Route>
            <Route path="/kalender/:id"> 
              <Activity />
            </Route>
            <Route path="/kalender"> <Calendar /> </Route>

            <Route path="/instellingen"> <Settings /> </Route>
            
            {/* Colosseum */}
            <Route path="/voorraad/statistieken"> 
              <ProtectedRoute allowedRoles={[Roles.Colosseum, Roles.Lid]} currentRoles={roles!} element={<Statistics />} />
            </Route>
            
            <Route path="/voorraad/inkopen/nieuw"> 
              <ProtectedRoute allowedRoles={[Roles.Admin, Roles.Senaat, Roles.Colosseum]} currentRoles={roles!} element={<NewPurchase />} />
            </Route>

            <Route path="/voorraad/inkopen"> 
              <ProtectedRoute allowedRoles={[Roles.Lid, Roles.Colosseum]} currentRoles={roles!} element={<Purchases />} />
            </Route>

            <Route path="/voorraad/streeplijsten/nieuw"> 
              <ProtectedRoute allowedRoles={[Roles.Admin, Roles.Senaat, Roles.Colosseum]} currentRoles={roles!} element={<NewSale />} />
            </Route>

            <Route path="/voorraad/streeplijsten"> 
              <ProtectedRoute allowedRoles={[Roles.Lid, Roles.Colosseum]} currentRoles={roles!} element={<Sales />} />
            </Route>

            <Route path="/voorraad"> 
              <ProtectedRoute allowedRoles={[Roles.Lid, Roles.Colosseum]} currentRoles={roles!} element={<Inventory />} />
            </Route>

            {/* Financieel */}
            <Route path="/financieel/mutaties/:activiteitId">
              <ProtectedRoute allowedRoles={[Roles.Admin, Roles.Senaat, Roles.Kasco]} currentRoles={roles!} element={<SalesMutation />} />
            </Route>

            <Route path="/financieel">
              <FinancialHome />
            </Route>
            

            {/* Admin routes */}
            <Route path="/admin/leden"> 
              <ProtectedRoute allowedRoles={[Roles.Admin, Roles.Senaat]} currentRoles={roles!} element={<Members/>} />
            </Route>

            <Route path="/admin/rollen/:role">
              <ProtectedRoute allowedRoles={[Roles.Admin, Roles.Senaat]} currentRoles={roles!} element={<RolePage />} />
            </Route>

            <Route path="/admin/rollen">
              <ProtectedRoute allowedRoles={[Roles.Admin, Roles.Senaat]} currentRoles={roles!} element={<AllRoles />} />
            </Route>

            <Route path="/admin"> 
              <ProtectedRoute allowedRoles={[Roles.Admin, Roles.Senaat]} currentRoles={roles!} element={<AdminPage/>} />
            </Route>

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