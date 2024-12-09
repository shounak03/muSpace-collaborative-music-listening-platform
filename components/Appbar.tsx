'use server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AudioWaveform, Music } from "lucide-react"
import { auth, signOut } from '@/auth'



export async function Appbar() {

  const session = await auth()
  // console.log(session);
  


  return (
    <nav className="bg-gradient-to-br from-gray-950 to-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <AudioWaveform className="h-6 w-6 text-purple-500" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text  bg-gradient-to-r from-purple-400  to-red-500 ">muSpace</h1>
        </Link>
        <div className="space-x-4">
          {!session?.user && (
            <>
              <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
                About
              </Link>
              <Link href="/auth/login">

                <Button
                  variant="outline"
                  className="text-white bg-black border-purple-400 hover:bg-purple-400 hover:text-gray-900"
                  size="sm"
                >
                  Sign-In

                </Button>
              </Link>

            </>
          )}
          {session?.user && (
            <form action={async()=>{
              'use server'
              await signOut()
            }}>

              <Button
                variant="outline"
                className="text-white bg-black border-purple-400 hover:bg-purple-400 hover:text-gray-900"
                size="sm"
              >
                Logout
              </Button>
            </form >

          )}
        </div>
      </div>
    </nav>
  )
}