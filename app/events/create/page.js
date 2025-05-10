import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import EventForm from '../../components/events/EventForm'

export const metadata = {
  title: 'Create Event - ASTU Event App',
  description: 'Create a new event',
}

export default function CreateEvent() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Create Event</h1>
        <EventForm />
      </main>
      <Footer />
    </div>
  )
} 