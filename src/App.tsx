import { ScaleFade } from '@chakra-ui/react'
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
import { Committee, CommitteeMember, CommitteeName, User } from './types/users'
import { client } from './utils/client'
import NewSalesMutation from './pages/financial/NewSalesMutation'
import { cache } from './utils/cache'
import Streeplijst from './pages/financial/Streeplijst'
import Chugs from './pages/chugs/Chugs'

export default function App() {
  // state
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser]       = useState<User>()
  const [committees, setCommittees] = useState<Committee[]>()
  const [icon, setIcon]       = useState<string>()

  // nav
  const [_, setLocation] = useLocation()


  useEffect(() => {
    const load = () => setTimeout(() => setLoading(false), 2000)

    client.get<{ user: User, committees: Committee[], committee_members: CommitteeMember[]}>('/user/')
      .then(u => {
        if (!u.user) {
          setLocation('/auth')
          setLoading(false)
          return
        }
        setUser(u.user)
        setIcon(u.user.profile_picture ?? './missing.jpg')
        setCommittees(u.committees)

        cache.set('user', u.user)
        cache.set('committees', u.committees)
        cache.set('committee_members', u.committee_members)

        load()
      })
      .catch(err => {
        console.error(err)
        // This endpoint only works when logged in
        setLocation('/auth')
        setLoading(false)
        return
      })

  }, [])

  const loadingPage = <LoadingPage />

  const f = [CommitteeName.FinanCie]
  const cf = [CommitteeName.Colosseum, CommitteeName.FinanCie]
  const mcf = [CommitteeName.Colosseum, CommitteeName.FinanCie, CommitteeName.Leden]

  if (loading) return loadingPage

  return <Router>
    <ScaleFade initialScale={0.98} in={!loading}>
      <Switch>

        {/* Pre-auth routes */}
        <Route path="/auth/forgot-password"><ForgotPassword /></Route>
        <Route path="/auth"><Auth /></Route>

        <SidebarWithHeader user={user!} icon={icon!} committees={committees!}>
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
              <ProtectedRoute allowed={mcf} current={committees!} element={<Statistics />} />
            </Route>
            
            <Route path="/voorraad/inkopen/nieuw"> 
              <ProtectedRoute allowed={cf} current={committees!} element={<NewPurchase />} />
            </Route>

            <Route path="/voorraad/inkopen"> 
              <ProtectedRoute allowed={mcf} current={committees!} element={<Purchases />} />
            </Route>

            <Route path="/voorraad/streeplijsten/nieuw"> 
              <ProtectedRoute allowed={cf} current={committees!} element={<NewSale />} />
            </Route>

            <Route path="/voorraad/streeplijsten"> 
              <ProtectedRoute allowed={mcf} current={committees!} element={<Sales />} />
            </Route>

            <Route path="/voorraad"> 
              <ProtectedRoute allowed={mcf} current={committees!} element={<Inventory />} />
            </Route>

            {/* Financieel */}
            <Route path="/financieel/mutaties/nieuw">
              <ProtectedRoute allowed={f} current={committees!} element={<NewSalesMutation committees={committees!} />} />
            </Route>
            <Route path="/financieel/mutaties/:activiteitId">
              <ProtectedRoute allowed={f} current={committees!} element={<SalesMutation />} />
            </Route>
            
            <Route path="/financieel/streeplijst/verwerk">
              <ProtectedRoute allowed={f} current={committees!} element={<Streeplijst />} />
            </Route>

            <Route path="/financieel">
              <FinancialHome />
            </Route>
            

            {/* Admin routes */}
            <Route path="/admin/leden"> 
              <ProtectedRoute allowed={[]} current={committees!} element={<Members/>} />
            </Route>

            <Route path="/admin/rollen/:role">
              <ProtectedRoute allowed={[]} current={committees!} element={<RolePage />} />
            </Route>

            <Route path="/admin/rollen">
              <ProtectedRoute allowed={[]} current={committees!} element={<AllRoles />} />
            </Route>

            <Route path="/admin"> 
              <ProtectedRoute allowed={[]} current={committees!} element={<AdminPage/>} />
            </Route>

            {/* User profile */}
            <Route path="/profile"> <EditProfile /> </Route>
            <Route path="/about"> <About /> </Route>

            {/* Chugs */}
            <Route path="/chugs"> <Chugs /> </Route>

            {/* Other */}
            <Route path="/"> <Index /> </Route>        
            <Route path="/:rest*"> <NotFound /> </Route>
          </Switch>
        </SidebarWithHeader>
      </Switch>
    </ScaleFade>
  </Router>

}