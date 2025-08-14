import Head from 'next/head';
import Hero from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
import ChooseExperience from '@/components/sections/ChooseExperience';
import SubscriptionPlans from '@/components/sections/SubscriptionPlans';
import WhyChooseThegio from '@/components/sections/WhyChooseThegio';
import Testimonials from '@/components/sections/Testimonials';
import CTA from '@/components/sections/CTA';

export default function Home() {
  return (
    <>
      <Head>
        <title>Thegio - Turn Your Life Stories into a Legacy</title>
        <meta name="description" content="A personalized book service that makes it easy to preserve wisdom, love, and memories for generations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Hero />
      <HowItWorks />
      <ChooseExperience />
      <SubscriptionPlans />
      <WhyChooseThegio />
      <Testimonials />
      <CTA />
    </>
  )
}