import SubscriptionCard from '../ui/SubscriptionCard';

const SubscriptionPlans = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">Subscription Plans</h2>
        <p className="mt-4 text-lg text-gray-600">Save money with our annual subscription plans.</p>
        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <SubscriptionCard 
            title="Monthly Plan"
            price="29"
            period="month"
            description="1 book per month + templates"
          />
          <SubscriptionCard 
            title="Annual Plan"
            price="199"
            period="year"
            description="12 books + premium features"
            isPopular={true}
          />
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;