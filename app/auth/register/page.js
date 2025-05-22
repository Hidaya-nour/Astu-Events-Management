import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import RegisterForm from '@/components/auth/SignUpForm'

export const metadata = {
  title: 'Register - ASTU Event App',
  description: 'Create an account for ASTU Event Management System',
}

export default function Register() {
  return (
    <div>
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Create Account</h1>
          <RegisterForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
} 