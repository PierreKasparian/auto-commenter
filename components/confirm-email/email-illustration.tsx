import { Mail } from "lucide-react"



export default function EmailIllustration() {
  return (
    <div className="flex justify-center">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className={`w-40 h-40 rounded-full "bg-primary"}`}></div>
        </div>

          <Mail className="h-24 w-24 text-primary relative z-10" />
        
      </div>
    </div>
  )
}
