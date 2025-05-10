import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import EventRequestList from '../../components/events/EventRequestList'

export const metadata = {
  title: 'Event Requests - ASTU Event App',
  description: 'Manage event requests',
}

export default function EventRequests() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Event Requests</h1>
        <EventRequestList />
      </main>
      <Footer />
    </div>
  )
} 