// path: apps/web/pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/context/AuthContext'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      {/* --- THIS IS THE FIX --- */}
      {/* Only show the customer Header and Footer if it's NOT an admin page */}
      {!isAdminPage && <Header />}
      
      <main>
        <Component {...pageProps} />
      </main>
      
      {!isAdminPage && <Footer />}
    </AuthProvider>
  )
}