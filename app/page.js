// import Header from '@/components/common/Header'
// import Footer from '@/components/home/footer'
// import Testimonial from '@/components/home/testimonials-section'
// import Features from '@/components/home/featured-events'
import { FeaturedEvents } from '@/components/home/featured-events'
import { HeroSection } from '@/components/home/hero-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'

export default function Home() {
  return (
    <div>
      <HeroSection/>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to ASTU Event App</h1>
        <FeaturedEvents />
        <TestimonialsSection />
      </main>
      <footer />
    </div>
  )
} 