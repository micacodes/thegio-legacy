import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/lib/api';
import { Order } from '@/lib/types';
import Button from '@/components/ui/Button';
import Image from 'next/image';

const EditorPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { projectId } = router.query;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Simulated editor content
  const [bookTitle, setBookTitle] = useState('');
  const [mainStory, setMainStory] = useState('');

  useEffect(() => {
    // Protect the route
    if (!isAuthLoading && !user) {
      router.push(`/login?redirect=/editor/${projectId}`);
    }

    // Fetch the project data from the backend
    if (user && typeof projectId === 'string') {
      api.getOrderById(projectId)
        .then(data => {
          if (data.userId !== user.id) {
             // Security check: Make sure the user owns this project
            setError('You do not have permission to view this page.');
            setTimeout(() => router.push('/dashboard'), 3000);
          } else {
            setOrder(data);
            setBookTitle(data.template?.name || 'My Legacy Book');
          }
        })
        .catch(() => setError('Could not load your project. Please try again.'))
        .finally(() => setIsLoading(false));
    }
  }, [user, isAuthLoading, projectId, router]);

  const handleSaveAndProofread = () => {
    if (!bookTitle.trim() || !mainStory.trim()) {
      alert("Please add a title and some story content before continuing.");
      return;
    }
    // In a real app, we would save the content to the backend here.
    // For now, we'll store it in localStorage to pass to the next page.
    localStorage.setItem(`project_${projectId}_title`, bookTitle);
    localStorage.setItem(`project_${projectId}_story`, mainStory);

    // Redirect to the proofreading page
    router.push(`/proofread/${projectId}`);
  };

  if (isAuthLoading || isLoading) {
    return <div className="text-center py-20">Loading Your Editor...</div>;
  }
  
  if (error) {
     return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-20">Project not found.</div>;
  }

  return (
    <>
      <Head>
        <title>Editing: {order.template?.name || 'Your Book'} - Thegio</title>
      </Head>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow-md">
            
            <div className="text-center border-b pb-6 mb-6">
                <h1 className="text-3xl font-bold text-brand-dark">Editing Your Legacy Book</h1>
                <p className="text-gray-500 mt-2">You are using the <span className="font-semibold text-brand-orange">{order.template?.name}</span> template.</p>
            </div>

            {/* Simulated Editor Form */}
            <div className="space-y-6">
                <div>
                    <label htmlFor="bookTitle" className="block text-lg font-semibold text-gray-700">Book Title</label>
                    <input 
                        type="text" 
                        id="bookTitle"
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        className="w-full mt-2 p-3 border rounded-md text-2xl"
                        placeholder="e.g., The Story of My Life"
                    />
                </div>
                <div>
                    <label htmlFor="mainStory" className="block text-lg font-semibold text-gray-700">Your Story</label>
                    <textarea 
                        id="mainStory"
                        value={mainStory}
                        onChange={(e) => setMainStory(e.target.value)}
                        rows={15}
                        className="w-full mt-2 p-3 border rounded-md"
                        placeholder="Once upon a time..."
                    />
                </div>
            </div>
            
            <div className="mt-8 text-right">
                <Button onClick={handleSaveAndProofread}>
                    Save & Continue to Proofread
                </Button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default EditorPage;