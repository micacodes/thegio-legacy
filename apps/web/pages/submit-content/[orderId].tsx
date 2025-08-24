import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/lib/api';
import { Order } from '@/lib/types';
import Button from '@/components/ui/Button';
import { FaImages } from 'react-icons/fa';

const FormSection = ({ step, title, subtitle, children }: { step: number; title: string; subtitle: string; children: React.ReactNode }) => (
  <div className="grid md:grid-cols-3 gap-8 items-start py-8 border-b last:border-b-0">
    <div className="md:col-span-1">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-brand-lime rounded-full flex items-center justify-center font-bold text-brand-dark text-lg">{step}</div>
        <h3 className="text-2xl font-bold text-brand-dark">{title}</h3>
      </div>
      <p className="text-gray-500 mt-2 ml-13">{subtitle}</p>
    </div>
    <div className="md:col-span-2 space-y-4">
      {children}
    </div>
  </div>
);

const SubmitContentPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { orderId } = router.query;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [bookTitle, setBookTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [designerNotes, setDesignerNotes] = useState('');

  // --- THIS IS THE FIX ---
  // The useEffect hook is now filled with the correct logic.
  useEffect(() => {
    // 1. Protect the route from non-logged-in users
    if (!isAuthLoading && !user) {
      if (orderId) { router.push(`/login?redirect=/submit-content/${orderId}`); }
    }

    // 2. Fetch the project data if the user is logged in and we have an orderId
    if (user && typeof orderId === 'string') {
      api.getOrderById(orderId)
        .then(data => {
          // 3. Security check: make sure the user owns this order
          if (data.userId !== user.id) {
            router.push('/dashboard'); // If not, send them away
          } else {
            setOrder(data);
          }
        })
        .catch(err => {
          console.error("Failed to fetch order", err);
          // If order not found, redirect to dashboard
          router.push('/dashboard');
        })
        .finally(() => {
          // 4. CRITICAL: Set loading to false so the page can render
          setIsLoading(false);
        });
    }
  }, [user, isAuthLoading, orderId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyContent.trim() && (!photos || photos.length === 0)) {
        alert("Please provide your story content and/or upload photos to continue.");
        return;
    }
    
    // In the future, this is where the actual file upload logic will go.
    console.log("Submitting content for order:", orderId);
    
    // After "submission", redirect to the checkout page.
    router.push(`/checkout/${orderId}`);
  };

  if (isAuthLoading || isLoading) {
    return <div className="text-center py-20">Loading Your Project...</div>;
  }

  return (
    <>
      <Head>
        <title>Submit Content for Your Premium Book - Thegio</title>
      </Head>
      <div className="bg-brand-peach/10 min-h-screen">
        <div className="container mx-auto px-6 py-16 max-w-5xl">
          
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">Your Premium Book Awaits</h1>
                <p className="text-gray-600 mt-4 text-lg">Provide the materials below. Our designers will craft them into a beautiful legacy.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
              
              <FormSection step={1} title="Book Title" subtitle="Give your masterpiece a name.">
                <input 
                  type="text" 
                  id="bookTitle"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-xl focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  placeholder="Inga Kimaru Family Legacy"
                />
              </FormSection>

              <FormSection step={2} title="Your Story" subtitle="Paste your full story, letters, or any text here.">
                <textarea 
                  id="storyContent"
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  rows={15}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  placeholder="Chapter 1: The Early Years..."
                />
              </FormSection>

              <FormSection step={3} title="Upload Photos" subtitle="Select all the high-quality images you want to include.">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:border-brand-orange transition-colors">
                  <FaImages className="mx-auto text-4xl text-gray-400 mb-4" />
                  <label htmlFor="photos" className="font-semibold text-brand-orange cursor-pointer hover:underline">
                    Click to browse files
                    <span className="text-gray-500 font-normal"> or drag and drop</span>
                  </label>
                  <input 
                    type="file"
                    id="photos"
                    multiple
                    onChange={(e) => setPhotos(e.target.files)}
                    className="opacity-0 w-0 h-0"
                  />
                  {photos && photos.length > 0 && (
                    <p className="mt-4 text-sm text-green-600 font-semibold">{photos.length} file(s) selected.</p>
                  )}
                </div>
              </FormSection>

              <FormSection step={4} title="Designer Notes" subtitle="Any special instructions? (e.g., 'Make the cover B&W').">
                <textarea 
                  id="designerNotes"
                  value={designerNotes}
                  onChange={(e) => setDesignerNotes(e.target.value)}
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  placeholder="Tell us anything that will help create your perfect book..."
                />
              </FormSection>

              <div className="mt-12 text-right">
                <Button type="submit" className="!rounded-lg !px-8 !py-4 text-lg">
                  Submit Content & Proceed to Payment
                </Button>
              </div>
            </form>
          
        </div>
      </div>
    </>
  );
};

export default SubmitContentPage;