import Image from 'next/image';
import Link from 'next/link';
import Button from '../ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-brand-bg/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          {/* You should have a logo file in the public folder */}
          <h1 className="text-2xl font-bold text-brand-orange">Thegio</h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/#how-it-works" className="hover:text-brand-orange transition-colors">How It Works</Link>
          <Link href="/pricing" className="hover:text-brand-orange transition-colors">Pricing</Link>
          <Link href="/#testimonials" className="hover:text-brand-orange transition-colors">Testimonials</Link>
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Only show the Dashboard button if we are NOT on the dashboard */}
              {router.pathname !== '/dashboard' && (
                <Link href="/dashboard">
                   <Button variant="outline">Dashboard</Button>
                </Link>
              )}
              <button onClick={logout} className="font-semibold text-gray-600 hover:text-brand-orange">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">
                <span className="font-semibold text-gray-600 hover:text-brand-orange">Log In</span>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;