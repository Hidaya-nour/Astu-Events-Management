import Head from 'next/head';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function About() {
  return (
    <div>
      <Head>
        <title>About Us - ASTU Event App</title>
        <meta name="description" content="About ASTU Event Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        <p className="text-lg text-center">
          ASTU Event App is a comprehensive event management system designed for students, organizers, and administrators.
        </p>
      </main>

      <Footer />
    </div>
  );
} 