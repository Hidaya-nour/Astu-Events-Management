import Head from 'next/head';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function Contact() {
  return (
    <div>
      <Head>
        <title>Contact Us - ASTU Event App</title>
        <meta name="description" content="Contact ASTU Event Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <p className="text-lg text-center">
          Reach out to us at support@astueventapp.com
        </p>
      </main>

      <Footer />
    </div>
  );
} 