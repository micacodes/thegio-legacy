import { FaStar } from 'react-icons/fa';

interface TestimonialCardProps {
  initials: string;
  name: string;
  role: string;
  quote: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ initials, name, role, quote }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg h-full border-l-4 border-brand-orange">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-brand-peach rounded-full flex items-center justify-center font-bold text-brand-dark">
          {initials}
        </div>
        <div className="ml-4">
          <p className="font-bold">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <p className="mt-6 text-gray-600">"{quote}"</p>
      <div className="flex mt-4">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="text-yellow-400 w-5 h-5" />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;