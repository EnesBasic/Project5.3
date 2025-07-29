import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Kalendar',
  description: 'Kreirano by Enes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ba">
      <body className={inter.className}>{children}</body>
    </html>
  )
}