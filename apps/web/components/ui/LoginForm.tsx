import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from './Button';
import Link from 'next/link';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      // Redirect will happen in AuthContext
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <Button type="submit" className="w-full">Log In</Button>
        </div>
      </form>
       <p className="text-center text-gray-600">
        Don't have an account? <Link href="/signup" className="text-brand-orange hover:underline">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginForm;