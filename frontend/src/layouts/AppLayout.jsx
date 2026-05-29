import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Topbar />
      <Sidebar />
      <main className="app-content">
        <div className="container-fluid py-4">
          <div className="content-card bg-white p-4 p-md-5">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

