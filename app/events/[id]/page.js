import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import EventDetail from '../../components/events/EventDetail'

export const metadata = {
  title: 'Event Details - ASTU Event App',
  description: 'View event details',
}

export default function EventPage({ params }) {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <EventDetail eventId={params.id} />
      </main>
      <Footer />
    </div>
  )
} 