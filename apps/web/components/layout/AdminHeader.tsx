import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const AdminHeader = () => {
  const { logout } = useAuth();
  return (
    <header className="bg-brand-dark text-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/admin">
          <h1 className="text-xl font-bold">Thegio Admin</h1>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/admin/orders" className="hover:text-brand-orange">Orders</Link>
          {/* Add more admin links here later */}
          <button onClick={logout} className="font-semibold hover:text-brand-orange">Logout</button>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;