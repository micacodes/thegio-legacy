import SignUpForm from '@/components/ui/SignUpForm';
import Head from 'next/head';

const SignUpPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up - Thegio</title>
      </Head>
      <div className="container mx-auto px-6 py-20 flex justify-center">
        <SignUpForm />
      </div>
    </>
  );
};

export default SignUpPage;