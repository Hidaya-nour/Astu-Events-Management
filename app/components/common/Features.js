export default function Features() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Event Management</h3>
            <p>Create, edit, and manage events with ease.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">User Authentication</h3>
            <p>Secure sign-up and sign-in for all users.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Role-based Access</h3>
            <p>Different dashboards for Admin, Student, and Organizer.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 