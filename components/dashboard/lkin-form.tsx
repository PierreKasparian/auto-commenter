"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Info } from "lucide-react"
import { LinkedInTokenInfoDialog } from "./find-tok-dialog"
import { linkedinConnect } from "@/utils/supabase/queries"
import { useState } from "react"


export function LinkedInConnectForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [accessToken, setAccessToken] = useState("")
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const userAgent = navigator.userAgent;
    console.log(userAgent)
    linkedinConnect(accessToken, userAgent)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm">Aucun compte LinkedIn connecté</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsDialogOpen(true)}
          aria-label="Informations sur l'access token"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Entrez votre access token LinkedIn"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Votre token est stocké de manière sécurisée et n&apos;est utilisé que pour les actions autorisées.
          </p>
        </div>
        <Button type="submit" className="w-full bg-[#0A66C2] hover:bg-[#004182]" disabled={!accessToken.trim()}>
          Connecter mon compte LinkedIn
        </Button>
      </form>

      <LinkedInTokenInfoDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
