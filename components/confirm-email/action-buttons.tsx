

import Link from "next/link"
import { Button } from "@/components/ui/button"


export default function ActionButtons() {


  return (
    <div className="flex flex-col space-y-4">
      <Link href="/dashboard">
      <Button>
          I&apos;ve verified my email
      </Button>
      </Link>
      <div className="flex justify-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/login">Back to login</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="mailto:ia.school.app@gmail.com">Need help?</Link>
        </Button>
      </div>
    </div>
  )
}
