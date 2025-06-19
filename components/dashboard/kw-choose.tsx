"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { saveElt } from "@/utils/supabase/queries"
import { toastStatusPop, toastErrorPop } from "@/utils/helpers"

export default function KeywordsChoose({unipileId, kw}: {unipileId: string, kw: string[]}) {
  const [keywords, setKeywords] = useState<string[]>(kw)
  const [newKeyword, setNewKeyword] = useState("")

  const addKeyword = async () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addKeyword()
    }
  }

  const handleSave = async () => {
    const result = await saveElt(keywords, unipileId, true)
    if (result.success) {
      toastStatusPop("Success ! 🎉", "Your keywords have been successfully saved")
    }else{
      toastErrorPop("Error", "Failed to save keywords")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black">LinkedIn Keyword Automation</CardTitle>
        <CardDescription>Select keywords that will automatically trigger comments on LinkedIn posts published within the last 24 hours.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Add a keyword..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="sm" onClick={addKeyword} disabled={!newKeyword.trim() || keywords.length > 3}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        <div className="min-h-20 p-3 border rounded-md bg-muted/40">
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="px-2 py-1">
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No keywords added yet. Add keywords to get started.
            </p>
          )}
        </div>


      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setKeywords([])}>Reset</Button>
        <Button type="button" onClick={() => handleSave()}>Save Configuration</Button>
      </CardFooter>
    </Card>
  )
}
