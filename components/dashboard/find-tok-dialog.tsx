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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>How to obtain your LinkedIn access token</DialogTitle>
          <DialogDescription>Follow these steps to generate an access token for the LinkedIn API</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 sm:max-w-2xl pr-12">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">1. Go to linkedin.com </h3>
            <p className="text-sm text-muted-foreground">
              Connect to linkedin.com on a new page.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium text-sm">2. Find the access token</h3>

            <ul className="list-disc list-inside text-sm text-muted-foreground pl-2">
              <li>Inspect the page by pressing f12 or right click &gt; inspect.</li>
              <li>Go to the &apos;Application&apos; page</li>
              <li>Go to the &apos;Cookies&apos; section</li>
              <li>In the Linkedin cookies find the &apos;li_at&apos; cookie</li>
              <li>Copy the value of the &apos;li_at&apos; cookie</li>
            </ul>
          </div>

        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
