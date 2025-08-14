import Button from '../ui/Button';
import { FaShieldAlt, FaShippingFast, FaUndo } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

const CTA = () => {
  // --- NEW LOGIC START ---
  const { user } = useAuth();
  const router = useRouter();

  const handleCreateBookClick = () => {
    // Logic is identical to the Hero button.
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/#pricing');
    }
  };

  // Replace this with your actual Calendly link
  const calendlyLink = "https://calendly.com/your-username/consultation";
  // --- NEW LOGIC END ---

  return (
    <section className="py-20 bg-brand-peach/20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">Your Legacy, Their Treasure</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Don't let your precious memories fade away. Create a beautiful legacy book that your family will cherish for generations to come.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* --- UPDATED BUTTON --- */}
          <Button onClick={handleCreateBookClick}>Create My Book Today</Button>
          
          {/* --- UPDATED BUTTON (now a Link opening a new tab) --- */}
          <a href={calendlyLink} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">Schedule a Call</Button>
          </a>
        </div>
        <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-gray-500 text-sm">
          <div className="flex items-center"><FaUndo className="mr-2" /> 30-day money-back guarantee</div>
          <div className="flex items-center"><FaShippingFast className="mr-2" /> Free shipping</div>
          <div className="flex items-center"><FaShieldAlt className="mr-2" /> Secure checkout</div>
        </div>
      </div>
    </section>
  );
};

export default CTA;