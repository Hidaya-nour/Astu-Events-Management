import './globals.css'

export const metadata = {
  title: 'ASTU Event App',
  description: 'ASTU Event Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
} 