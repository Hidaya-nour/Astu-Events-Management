import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import SignInForm from '@/components/auth/SignInForm'

export const metadata = {
  title: 'Sign In - ASTU Event App',
  description: 'Sign in to your ASTU Event Management System account',
}

export default function SignIn() {
  return (
    <div>
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <SignInForm />
        </div>
      </main>
      <SiteFooter />
      </div>
  )
} 