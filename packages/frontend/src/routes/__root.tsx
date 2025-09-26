import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function RootLayout() {
  return (
    <>
      <Header />
      <main className="m-2">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export const Route = createRootRoute({ component: RootLayout })
