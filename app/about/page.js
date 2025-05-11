import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export const metadata = {
  title: 'About Us - ASTU Event App',
  description: 'About ASTU Event Management System',
};

export default function About() {
  return (
    <div>
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