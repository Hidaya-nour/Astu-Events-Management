import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Testimonial from './components/common/Testimonial'
import Features from './components/common/Features'

export default function Home() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to ASTU Event App</h1>
        <Features />
        <Testimonial />
      </main>
      <Footer />
    </div>
  )
} 