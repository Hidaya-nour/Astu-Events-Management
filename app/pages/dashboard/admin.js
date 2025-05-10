import Head from 'next/head';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

export default function AdminDashboard() {
  return (
    <div>
      <Head>
        <title>Admin Dashboard - ASTU Event App</title>
        <meta name="description" content="Admin Dashboard for ASTU Event Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">User Management</h3>
            <p>Manage users, roles, and permissions.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Event Management</h3>
            <p>Approve, reject, or delete events.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Support Requests</h3>
            <p>View and respond to support tickets.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 