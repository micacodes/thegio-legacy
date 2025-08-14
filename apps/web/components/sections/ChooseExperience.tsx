import PricingCard from '../ui/PricingCard';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/lib/api';

const ChooseExperience = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handlePurchase = async (type: 'DIY' | 'PREMIUM') => {
    if (!user) {
      router.push('/login');
      return;
    }

    const params = type === 'DIY' 
      ? { type: 'DIY', amountInCents: 4900, productName: 'DIY Legacy Book' }
      : { type: 'PREMIUM', amountInCents: 14900, productName: 'Premium Legacy Book' };

    try {
      const session = await api.createStripeCheckoutSession(params);
      window.location.href = session.url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Could not connect to payment service. Please try again later.');
    }
  };

  const diyFeatures = [ /* ...features... */ ];
  const premiumFeatures = [ /* ...features... */ ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">Choose Your Experience</h2>
        <p className="mt-4 text-lg text-gray-600">Whether you want to create it yourself or have us handle everything, we've got the perfect option for you.</p>
        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* NOTE: We need to update the PricingCard component to accept an onClick handler */}
          <div onClick={() => handlePurchase('DIY')}>
            <PricingCard title="DIY Design" description="Easy online editor" price={49} features={diyFeatures} />
          </div>
          <div onClick={() => handlePurchase('PREMIUM')}>
            <PricingCard title="Premium Done-for-You" description="We handle everything" price={149} features={premiumFeatures} isPopular={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChooseExperience;