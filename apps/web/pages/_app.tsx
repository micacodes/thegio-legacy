import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/context/AuthContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </AuthProvider>
  )
}