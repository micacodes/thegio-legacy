import PricingCard from '../ui/PricingCard';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/lib/api';
import { useState } from 'react';

const ChooseExperience = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectExperience = async (type: 'DIY' | 'PREMIUM') => {
    setIsLoading(true);
    if (!user) {
      router.push(`/login?redirect=${type === 'DIY' ? '/templates' : '/pricing'}`);
      return;
    }

    try {
      if (type === 'DIY') {
        // For DIY, we just go to the template gallery.
        router.push('/templates');
      } else {
        // For Premium, we create a draft order and go to the submission page.
        const newOrder = await api.createDraftOrder(null, 'PREMIUM');
        router.push(`/submit-content/${newOrder.id}`);
      }
    } catch (error) {
      console.error('Failed to start experience:', error);
      alert('Something went wrong. Please try again.');
      setIsLoading(false);
    }

  };

  const diyFeatures = [
    'Drag-and-drop editor',
    '50+ professional templates',
    'Unlimited revisions',
    'Premium printing & delivery',
  ];

  const premiumFeatures = [
    'Personal design consultation',
    'Professional editing & layout',
    'Custom cover design',
    'Premium materials & finishing',
    'Priority support',
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">Choose Your Experience</h2>
        <p className="mt-4 text-lg text-gray-600">Whether you want to create it yourself or have us handle everything, we've got the perfect option for you.</p>
        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          <div onClick={() => !isLoading && handleSelectExperience('DIY')} className="h-full">
            <PricingCard 
              title="DIY Design"
              description="For the creative spirit"
              price={49}
              features={diyFeatures}
            />
          </div>

          <div onClick={() => !isLoading && handleSelectExperience('PREMIUM')} className="h-full">
            <PricingCard 
              title="Premium Done-for-You"
              description="Our experts handle everything"
              price={149}
              features={premiumFeatures}
              isPopular={true}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default ChooseExperience;