import './globals.css'; // or your main css file
import { AuthProvider } from '@/contexts/auth-context'; // Adjust path if needed

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Your Header, Footer, or other layout components can go here */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
