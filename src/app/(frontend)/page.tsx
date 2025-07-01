import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { StarfieldCanvas } from './components/StarfieldCanvas'
import { Footer } from './components/Footer'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <>
      <StarfieldCanvas className="fixed top-0 left-0 w-full h-full z-[1]" />
      <div className="scroll-container relative z-[2] w-full">
        <div className="flex items-center justify-center bg-gray-100 p-4">
          <Card className="w-full max-w-md p-6 shadow-lg rounded-lg">
            <CardContent className="flex flex-col items-center text-center">
              <picture>
                <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
                <Image
                  alt="Payload Logo"
                  height={65}
                  src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
                  width={65}
                />
              </picture>
              {!user && (
                <Alert className="mt-4 bg-green-500 text-white border-none">
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>Tailwind is finally working 🎉</AlertDescription>
                </Alert>
              )}
              {user && <h1 className="text-2xl font-bold mt-4">Welcome back, {user.email}</h1>}
              <div className="flex flex-col space-y-4 mt-6 w-full">
                <Button asChild>
                  <a href={payloadConfig.routes.admin} rel="noopener noreferrer" target="_blank">
                    Go to admin panel
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://payloadcms.com/docs" rel="noopener noreferrer" target="_blank">
                    Documentation
                  </a>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center text-center mt-6 text-sm text-gray-600">
              <p>Update this page by editing</p>
              <a className="text-blue-600 hover:underline mt-1" href={fileURL}>
                <code>app/(frontend)/page.tsx</code>
              </a>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    </>
  )
}
