import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import LoginForm from '../../components/auth/LoginForm'

export const metadata = {
  title: 'Login - ASTU Event App',
  description: 'Login to ASTU Event Management System',
}

export default function Login() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Login</h1>
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
} 