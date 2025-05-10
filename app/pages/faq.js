import Head from 'next/head';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function FAQ() {
  return (
    <div>
      <Head>
        <title>FAQ - ASTU Event App</title>
        <meta name="description" content="Frequently Asked Questions - ASTU Event Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">How do I sign up?</h3>
            <p>Click on the Sign In link and follow the registration process.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">How do I create an event?</h3>
            <p>Log in as an Organizer and navigate to the dashboard to create events.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">How do I contact support?</h3>
            <p>Visit the Contact Us page or email us at support@astueventapp.com.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 