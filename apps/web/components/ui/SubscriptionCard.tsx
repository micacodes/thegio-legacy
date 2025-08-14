import Button from './Button';

interface SubscriptionCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  isPopular?: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ title, price, period, description, isPopular = false }) => {
  return (
    <div className={`relative bg-white p-8 rounded-2xl shadow-lg border-2 ${isPopular ? 'border-brand-orange' : 'border-gray-200'}`}>
      {isPopular && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-orange-200 text-brand-orange text-sm font-semibold px-4 py-1 rounded-full">
          Save 40%
        </div>
      )}
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-4xl font-extrabold mt-4">${price}<span className="text-lg font-medium text-gray-500">/{period}</span></p>
      <p className="mt-2 text-gray-500">{description}</p>
      <div className="mt-8">
        <Button variant={isPopular ? 'primary' : 'outline'} className="w-full">{isPopular ? 'Choose Annual' : 'Choose Monthly'}</Button>
      </div>
    </div>
  );
};

export default SubscriptionCard;