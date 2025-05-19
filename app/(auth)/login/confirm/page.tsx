
import EmailIllustration from "@/components/confirm-email/email-illustration"
import ConfirmationMessage from "@/components/confirm-email/confirmation-message"
import ActionButtons from "@/components/confirm-email/action-buttons"

export default function ConfirmEmailPage() {


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center space-y-8">
            <EmailIllustration  />


                <ConfirmationMessage />


                <ActionButtons/>


          </div>
        </div>
      </main>
    </div>
  )
}
