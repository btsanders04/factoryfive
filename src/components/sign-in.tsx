import { signIn } from "@/auth"

import { FaGoogle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
    <Button type="submit" variant="outline" className="w-full bg-white hover:bg-slate-100 text-slate-800 border-slate-300">
            <FaGoogle className="mr-2" />
            Sign in with Google
    </Button>
    </form>
  )
} 