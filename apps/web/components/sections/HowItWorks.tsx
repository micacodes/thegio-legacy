const HowItWorks = () => {
  const steps = [
    { num: 1, title: 'Choose Your Template', description: 'Select from our beautifully designed templates or start with a blank canvas. Each template is crafted to tell your unique story.' },
    { num: 2, title: 'Add Your Stories and Photos', description: 'Use our intuitive editor to add your memories, photos, and life lessons. No design experience needed—we make it simple.' },
    { num: 3, title: 'We Print and Deliver', description: 'We print your book on premium materials and deliver it right to your door. Your legacy, beautifully preserved.' },
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">How It Works</h2>
        <p className="mt-4 text-lg text-gray-600">Creating your legacy book is simple. Just three easy steps to preserve your most precious memories.</p>
        <div className="mt-16 grid md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-lime rounded-full flex items-center justify-center text-2xl font-bold text-brand-dark">{step.num}</div>
              <h3 className="mt-6 text-2xl font-bold">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;