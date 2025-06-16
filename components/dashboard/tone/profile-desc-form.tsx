"use client"
import { editProfileDescription } from '@/utils/supabase/queries'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toastStatusPop, toastErrorPop } from "@/utils/helpers"

const ProfileDescriptionForm = ({profileDesc}: {profileDesc: string}) => {
  const [profileDescription, setProfileDescription] = useState<string>(profileDesc)
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const result = await editProfileDescription(profileDescription)
      if (result.success) {
        toastStatusPop("Success ! 🎉", "Your profile description has been successfully updated")
      }else{
        toastErrorPop("Error", "Failed to update profile description")
      }
    }
    return (
    <form onSubmit={handleSubmit} className="space-y-2 px-6 mt-4">
        <Label htmlFor="profile-description">Profile description</Label>
        <Textarea
          id="profile-description"
          placeholder="Enter your profile description"
          value={profileDescription}
          onChange={(e) => setProfileDescription(e.target.value)}
        />
        <p className="text-xs text-gray-500">
        The AI will use this profile description to generate more effective comment suggestions. Add information to improve your comments suggestions. This won't appear on your Linkedin profile.</p>
        <Button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700">
          Edit profile description
        </Button>
    </form>
  )
}

export default ProfileDescriptionForm