import React from 'react';
import Button from './Button';
import { FaCheck } from 'react-icons/fa';

interface PricingCardProps {
  title: string;
  description: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  title, 
  description, 
  price, 
  features, 
  isPopular = false 
}) => {
  return (
    // The parent div in ChooseExperience.tsx will have the onClick handler.
    // We add cursor-pointer and hover effects here to show it's clickable.
    <div className={`relative bg-white p-8 rounded-2xl shadow-lg h-full border-2 ${isPopular ? 'border-brand-orange' : 'border-transparent'} cursor-pointer hover:scale-105 transition-transform`}>
      
      {isPopular && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-orange text-white text-sm font-semibold px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}

      <h3 className="text-2xl font-bold text-center">{title}</h3>
      <p className="mt-2 text-gray-500 text-center">{description}</p>
      
      <div className="mt-8 text-center">
        <span className="text-5xl font-extrabold">${price}</span>
        <span className="text-gray-500">/per book</span>
      </div>

      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <FaCheck className="text-brand-orange w-5 h-5 mr-3 mt-1 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-10">
        {/* pointer-events-none ensures the click is handled by the parent div */}
        <Button 
          variant={isPopular ? 'primary' : 'secondary'} 
          className="w-full pointer-events-none"
        >
          {isPopular ? 'Get Started' : 'Start Creating'}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;