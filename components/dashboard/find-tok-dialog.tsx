"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface LinkedInTokenInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LinkedInTokenInfoDialog({ open, onOpenChange }: LinkedInTokenInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Comment obtenir votre access token LinkedIn</DialogTitle>
          <DialogDescription>Suivez ces étapes pour générer un access token pour l&apos;API LinkedIn</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">1. Créer une application LinkedIn</h3>
            <p className="text-sm text-muted-foreground">
              Rendez-vous sur le portail développeur LinkedIn et créez une nouvelle application.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium text-sm">2. Configurer les autorisations</h3>
            <p className="text-sm text-muted-foreground">
              Dans les paramètres de votre application, activez les autorisations suivantes :
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground pl-2">
              <li>r_liteprofile</li>
              <li>r_emailaddress</li>
              <li>w_member_social</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium text-sm">3. Générer un access token</h3>
            <p className="text-sm text-muted-foreground">
              Utilisez l&apos;outil d&apos;authentification OAuth 2.0 pour générer un token. Vous pouvez également utiliser le
              flux d&apos;autorisation avec l&apos;URL suivante :
            </p>
            <div className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
              https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=r_liteprofile%20r_emailaddress%20w_member_social
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium text-sm">4. Échanger le code contre un token</h3>
            <p className="text-sm text-muted-foreground">
              Après avoir obtenu le code d&apos;autorisation, échangez-le contre un access token en faisant une requête POST
              à l&apos;endpoint token de LinkedIn.
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button variant="outline" onClick={() => window.open("https://developer.linkedin.com/", "_blank")}>
            Visiter le portail développeur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
