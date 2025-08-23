import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/lib/api';
import { Template } from '@/lib/types';
import TemplateCard from '@/components/ui/TemplateCard';

const TemplatesPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/templates');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) { // Only fetch templates if the user is logged in
      api.getTemplates()
        .then(data => {
          setTemplates(data);
        })
        .catch(error => {
          console.error('Failed to fetch templates:', error);
        })
        .finally(() => {
          setLoadingTemplates(false);
        });
    } else if (!isLoading) {
      setLoadingTemplates(false);
    }
  }, [user, isLoading]);

  const handleSelectTemplate = async (templateId: string) => {
    try {
      // --- THIS IS THE FIX ---
      // We are now passing the second required argument: the type 'DIY'.
      const newOrder = await api.createDraftOrder(templateId, 'DIY');
      const projectId = newOrder.id;
      
      router.push(`/editor/${projectId}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("There was an error creating your project. Please try again.");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Verifying your session...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Choose a Template - Thegio</title>
      </Head>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">Start Your Creation</h1>
            <p className="mt-4 text-lg text-gray-600">Select a beautiful, pre-designed template to begin your legacy book.</p>
          </div>

          {loadingTemplates ? (
            <div className="text-center py-10">
              <p className="text-lg font-semibold">Loading templates...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {templates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleSelectTemplate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TemplatesPage;