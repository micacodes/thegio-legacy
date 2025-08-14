import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import * as api from '@/lib/api';
import Head from 'next/head';
import Button from '@/components/ui/Button';

const PremiumUploadPage = () => {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [storyFile, setStoryFile] = useState<File | null>(null);
    const [photoZip, setPhotoZip] = useState<File | null>(null);
    const [instructions, setInstructions] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // This effect handles authentication and redirects.
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: 'story' | 'photos') => {
        if (e.target.files && e.target.files[0]) {
            if (fileType === 'story') {
                setStoryFile(e.target.files[0]);
            } else {
                setPhotoZip(e.target.files[0]);
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!storyFile || !photoZip) {
            setError('Please upload both your story and a zip file of your photos.');
            return;
        }
        
        setIsUploading(true);
        setError('');

        try {
            // 1. Create a FormData object to bundle the files for sending
            const formData = new FormData();
            formData.append('storyFile', storyFile);
            formData.append('photoZip', photoZip);

            // 2. Upload the files directly to our backend using the new API function
            const { storyFileUrl, photoZipUrl } = await api.uploadPremiumFiles(formData);

            // 3. Prepare the data for the checkout session
            const contentJson = JSON.stringify({
                storyFileUrl, // Use the local URL returned by the server
                photoZipUrl,  // Use the local URL returned by the server
                instructions,
            });
            
            // This is a placeholder shipping address for now.
            // In a real app, you would collect this from a form.
            const shippingAddressJson = JSON.stringify({
                firstName: user?.name || user?.username,
                lastName: "",
                email: user?.email,
                phone: "",
                country: "US",
                region: "CA",
                address1: "123 Main St",
                city: "San Francisco",
                zip: "94105",
            });

            // 4. Create a checkout session with the local file URLs in the metadata
            const session = await api.createStripeCheckoutSession({
                type: 'PREMIUM',
                amountInCents: 14900,
                productName: 'Premium Done-for-You Book',
                contentJson,
                shippingAddressJson,
            });

            // 5. Redirect the user to Stripe's secure payment page
            window.location.href = session.url;

        } catch (err: any) {
            setError(err.message || 'An error occurred during upload. Please try again.');
            setIsUploading(false);
        }
    };
    
    // Show a loading screen while we verify the user's session
    if (authLoading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Premium Service Upload - Thegio</title>
            </Head>
            <div className="container mx-auto px-6 py-12 max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-dark">Premium Service: Upload Your Content</h1>
                    <p className="text-gray-600 mt-2">Provide your stories and photos below. Our professional designers will take it from here!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md border border-gray-200">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">1. Upload Your Story</label>
                        <p className="text-xs text-gray-500 mb-2">A single document (.docx, .txt, .pdf).</p>
                        <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, 'story')} 
                            accept=".docx,.txt,.pdf" 
                            required 
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-peach/30 file:text-brand-orange hover:file:bg-brand-peach/50"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">2. Upload Your Photos (in a .zip file)</label>
                        <p className="text-xs text-gray-500 mb-2">Please compress all your photos into a single .zip file.</p>
                        <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, 'photos')} 
                            accept=".zip" 
                            required 
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-peach/30 file:text-brand-orange hover:file:bg-brand-peach/50"
                        />
                    </div>
                     
                    <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">3. Special Instructions</label>
                        <p className="text-xs text-gray-500 mb-2">Let our designers know about any special requests.</p>
                        <textarea 
                            id="instructions" 
                            value={instructions} 
                            onChange={(e) => setInstructions(e.target.value)} 
                            rows={4} 
                            className="w-full mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange p-2" 
                            placeholder="e.g., Please use the photo of my grandparents on the cover. Arrange the other photos chronologically."
                        ></textarea>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    
                    <div className="pt-2">
                        <Button type="submit" disabled={isUploading} className="w-full text-lg">
                            {isUploading ? 'Uploading Files...' : 'Proceed to Payment ($149)'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default PremiumUploadPage;