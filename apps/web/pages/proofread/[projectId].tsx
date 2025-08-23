import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const ProofreadPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { projectId } = router.query;

  const [bookTitle, setBookTitle] = useState('');
  const [mainStory, setMainStory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Standard route protection
    if (!isAuthLoading && !user) {
      router.push(`/login?redirect=/proofread/${projectId}`);
    }

    // Retrieve the content from localStorage
    if (user && typeof projectId === 'string') {
      const storedTitle = localStorage.getItem(`project_${projectId}_title`);
      const storedStory = localStorage.getItem(`project_${projectId}_story`);

      if (storedTitle && storedStory) {
        setBookTitle(storedTitle);
        setMainStory(storedStory);
      } else {
        // If content is missing, maybe redirect back to the editor
        console.warn("No content found in localStorage for this project.");
        // For a better UX, you might want to fetch the order and check if content is saved there
      }
      setIsLoading(false);
    }
  }, [user, isAuthLoading, projectId, router]);

  const handleConfirmAndCheckout = () => {
    // Simply redirect to the dedicated checkout page
    router.push(`/checkout/${projectId}`);
  };
  
  if (isAuthLoading || isLoading) {
    return <div className="text-center py-20">Loading Your Preview...</div>;
  }

  return (
    <>
      <Head>
        <title>Proofread Your Book - Thegio</title>
      </Head>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-md">
            <div className="text-center border-b pb-6 mb-6">
              <h1 className="text-3xl font-bold text-brand-dark">Proofread Your Book</h1>
              <p className="text-gray-500 mt-2">This is your final chance to review your content. Please read carefully before continuing.</p>
            </div>

            {/* Display the content in a clean, readable format */}
            <article className="prose lg:prose-xl max-w-none">
              <h1>{bookTitle}</h1>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {mainStory || "It looks like your story is empty. You can go back to edit it."}
              </p>
            </article>

            <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <Link href={`/editor/${projectId}`}>
                <span className="font-semibold text-gray-600 hover:text-brand-orange">&larr; Go Back to Editor</span>
              </Link>
              <Button onClick={handleConfirmAndCheckout} className="w-full md:w-auto">
                Confirm & Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProofreadPage;