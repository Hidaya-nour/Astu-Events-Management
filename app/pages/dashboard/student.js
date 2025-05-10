import Head from 'next/head';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

export default function StudentDashboard() {
  return (
    <div>
      <Head>
        <title>Student Dashboard - ASTU Event App</title>
        <meta name="description" content="Student Dashboard for ASTU Event Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Student Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">My Events</h3>
            <p>View and manage your registered events.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Event Requests</h3>
            <p>Request new events or view status.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Help & Support</h3>
            <p>Submit support tickets or view responses.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 