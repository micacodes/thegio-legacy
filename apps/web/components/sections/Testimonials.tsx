import TestimonialCard from '../ui/TestimonialCard';

const Testimonials = () => {
  const testimonials = [
    { initials: 'SM', name: 'Sarah Martinez', role: 'Grandmother', quote: "Creating a book for my grandchildren was so easy with Thegio. The final product exceeded my expectations - it's absolutely beautiful!" },
    { initials: 'DJ', name: 'David Johnson', role: 'Father', quote: "The premium service was worth every penny. They captured my family's story perfectly, and the kids treasure their personalized book." },
    { initials: 'LT', name: 'Lisa Thompson', role: 'Gift Giver', quote: "I created a memory book for my parents' 50th anniversary. They cried happy tears when they saw it. Best gift I've ever given!" },
  ];

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">What Our Families Say</h2>
        <p className="mt-4 text-lg text-gray-600">Stories from families who've preserved their legacy with Thegio.</p>
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;