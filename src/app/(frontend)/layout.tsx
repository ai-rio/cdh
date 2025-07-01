import React from 'react'
import './styles.css'
import { Header } from './components/Header'


export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-20">{children}</main>
        
      </body>
    </html>
  )
}
