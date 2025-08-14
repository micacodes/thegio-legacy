import LoginForm from '@/components/ui/LoginForm';
import Head from 'next/head';

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login - Thegio</title>
      </Head>
      <div className="container mx-auto px-6 py-20 flex justify-center">
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;