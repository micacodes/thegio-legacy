import { FaBolt, FaPalette, FaGem, FaHeart } from 'react-icons/fa';

const WhyChooseThegio = () => {
  const reasons = [
    { icon: <FaBolt className="w-8 h-8 text-brand-lime" />, title: 'Fully Automated', description: 'No tech skills needed. Our platform handles everything automatically.' },
    { icon: <FaPalette className="w-8 h-8 text-brand-peach" />, title: 'Customizable Design', description: 'Choose from hundreds of covers, layouts, and styling options.' },
    { icon: <FaGem className="w-8 h-8 text-brand-lime" />, title: 'Premium Materials', description: 'Printed on high-quality paper with durable, beautiful binding.' },
    { icon: <FaHeart className="w-8 h-8 text-brand-peach" />, title: 'Made with Love', description: 'Every book is crafted with care to preserve your most precious memories.' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">Why Choose Thegio?</h2>
        <p className="mt-4 text-lg text-gray-600">We've made preserving your legacy simple, beautiful, and meaningful.</p>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {reasons.map((reason, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                {reason.icon}
              </div>
              <h3 className="mt-6 text-2xl font-bold">{reason.title}</h3>
              <p className="mt-2 text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseThegio;