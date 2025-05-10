import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import SignInForm from '../../components/auth/SignInForm'

export const metadata = {
  title: 'Sign In - ASTU Event App',
  description: 'Sign in to your ASTU Event Management System account',
}

export default function SignIn() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Sign In</h1>
          <SignInForm />
        </div>
      </main>
      <Footer />
    </div>
  )
} 