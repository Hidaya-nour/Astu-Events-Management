import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export const metadata = {
  title: 'Contact Us - ASTU Event App',
  description: 'Contact ASTU Event Management System',
};

export default function Contact() {
  return (
    <div>
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