import Image from 'next/image';
import Button from '../ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Hero = () => {
  // --- NEW LOGIC START ---
  const { user } = useAuth();
  const router = useRouter();

  const handleStartBookClick = () => {
    // If the user is logged in, send them to their dashboard.
    if (user) {
      router.push('/dashboard');
    } else {
      // If logged out, scroll them to the pricing/options section.
      router.push('/#pricing');
    }
  };
  // --- NEW LOGIC END ---

  return (
    <section className="bg-brand-peach/20 py-20 md:py-32">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-brand-dark">
            Turn Your Life Stories into a Legacy <span className="text-brand-orange">That Lasts Forever</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            A personalized book service that makes it easy to preserve wisdom, love, and memories for generations.
          </p>
          <div className="mt-8 flex justify-center md:justify-start space-x-4">
            {/* --- UPDATED BUTTON --- */}
            <Button onClick={handleStartBookClick}>Start Your Book</Button>
            
            {/* --- UPDATED BUTTON (now a Link) --- */}
            <Link href="/#templates" passHref>
              <Button variant="outline">See Examples</Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          {/* You need to have this image in your apps/web/public/ folder */}
          <Image 
            src="/book-mockup.png" 
            alt="Mockup of a Thegio legacy book" 
            width={350} 
            height={450} 
            className="shadow-2xl rounded-lg"
            priority // Helps with loading performance for above-the-fold images
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;