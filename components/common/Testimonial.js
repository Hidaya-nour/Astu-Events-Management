export default function Testimonial() {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="italic">"ASTU Event App made organizing events a breeze!"</p>
            <p className="font-bold mt-2">- John Doe</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="italic">"The best event management system I've used."</p>
            <p className="font-bold mt-2">- Jane Smith</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="italic">"Highly recommended for all event organizers."</p>
            <p className="font-bold mt-2">- Mike Johnson</p>
          </div>
        </div>
      </div>
    </section>
  );
} 