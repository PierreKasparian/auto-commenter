
export default function ConfirmationMessage() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">Check your inbox</h1>
      <p className="text-gray-500">
        We&apos;ve sent a verification link to <span className="font-medium text-gray-700">your email address</span>
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Click the link in the email to verify your account. If you don&apos;t see the email, check your spam folder.
      </p>
    </div>
  )
}
