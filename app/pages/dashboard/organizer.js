import Head from 'next/head';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

export default function OrganizerDashboard() {
  return (
    <div>
      <Head>
        <title>Organizer Dashboard - ASTU Event App</title>
        <meta name="description" content="Organizer Dashboard for ASTU Event Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Organizer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">My Events</h3>
            <p>Create, edit, or delete your events.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Attendee Management</h3>
            <p>View and manage event attendees.</p>
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