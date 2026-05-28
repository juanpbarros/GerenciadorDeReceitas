import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        <aside className="md:sticky md:top-[72px] md:h-[calc(100vh-72px)] md:self-start">
          <Sidebar />
        </aside>
        <main className="min-w-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

