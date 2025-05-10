import Head from 'next/head';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Testimonial from '../components/common/Testimonial';
import Features from '../components/common/Features';

export default function Home() {
  return (
    <div>
      <Head>
        <title>ASTU Event App</title>
        <meta name="description" content="ASTU Event Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to ASTU Event App</h1>
        <Features />
        <Testimonial />
      </main>

      <Footer />
    </div>
  );
} 