import { Routes, Route } from 'react-router-dom'
import { AnimatorGeneralProvider, BleepsProvider } from '@arwes/react'
import './app.css'
import { animatorGeneral, bleepsSettings } from './arwesConfig'
import AppShell from './components/AppShell.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Roadmap from './pages/Roadmap.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <AnimatorGeneralProvider duration={animatorGeneral.duration}>
      <BleepsProvider master={bleepsSettings.master} bleeps={bleepsSettings.bleeps}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BleepsProvider>
    </AnimatorGeneralProvider>
  )
}
