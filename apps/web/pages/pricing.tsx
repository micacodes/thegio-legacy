import Head from 'next/head';
import ChooseExperience from '@/components/sections/ChooseExperience';
import SubscriptionPlans from '@/components/sections/SubscriptionPlans';

const PricingPage = () => {
    return (
        <>
            <Head>
                <title>Pricing & Plans - Thegio</title>
            </Head>
            {/* We can reuse the components from the landing page */}
            <ChooseExperience />
            <SubscriptionPlans />
        </>
    );
};

export default PricingPage;