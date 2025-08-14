// path: apps/web/components/ui/SignUpForm.tsx
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from './Button';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUpForm = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    setIsLoading(true);
    try {
      await signup({ name, username, email, phone, password });
      // Redirect happens in AuthContext
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-8 md:p-12 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-brand-dark">Create Your Legacy Account</h2>
        <p className="mt-2 text-gray-500">Join our community and start preserving your memories.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
          <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" />
        </div>
        
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 px-3 flex items-center text-gray-500 hover:text-brand-orange">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="relative">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 px-3 flex items-center text-gray-500 hover:text-brand-orange">
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
        
        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-gray-600">
        Already have an account? <Link href="/login" className="font-medium text-brand-orange hover:underline">Log in here</Link>
      </p>
    </div>
  );
};

export default SignUpForm;