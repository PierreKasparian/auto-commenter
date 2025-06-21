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

export default function AccountsChoose({unipileId, accounts}: {unipileId: string, accounts: string[]}) {
  const [accountsList, setAccountsList] = useState<string[]>(accounts)
  const [newAccount, setNewAccount] = useState("")

  const addAccount = async () => {
    if (newAccount.trim() && !accountsList.includes(newAccount.trim()) && accountsList.length < 4) {
      setAccountsList([...accountsList, newAccount.trim()])
      setNewAccount("")
    }
  }

  const removeAccount = (accountToRemove: string) => {
    setAccountsList(accountsList.filter((account) => account !== accountToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addAccount()
    }
  }

  const handleSave = async () => {
    const result = await saveElt(accountsList, unipileId, false)
    if (result.success) {
      toastStatusPop("Success ! 🎉", "Your accounts have been successfully saved")
    }else{
      toastErrorPop("Error", "Failed to save accounts")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black">LinkedIn Account Automation</CardTitle>
        <CardDescription>Select accounts that will automatically trigger comments on LinkedIn posts published within the last 24 hours.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="paste profile link: https://www.linkedin.com/in/account-id/"
            value={newAccount}
            onChange={(e) => {
              const value = e.target.value.trim();
              if (!value) {
                setNewAccount("");
                return;
              }
              try {
                const parts = value.split("/");
                if (parts.length < 2) {
                  setNewAccount("");
                  return;
                }
                const lastPart = parts[parts.length - 2];
                if (lastPart && lastPart.length > 0) {
                  setNewAccount(lastPart);
                }
              } catch (error) {
                console.log(error)
                setNewAccount("");
              }
            }}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="sm" onClick={addAccount} disabled={!newAccount.trim() || accountsList.length >= 4}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        <div className="min-h-20 p-3 border rounded-md bg-muted/40">
          {accountsList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {accountsList.map((account) => (
                <Badge key={account} variant="secondary" className="px-2 py-1">
                  {account}
                  <button
                    onClick={() => removeAccount(account)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No accounts added yet. Add accounts to get started.
            </p>
          )}
        </div>


      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setAccountsList([])}>Reset</Button>
        <Button type="button" onClick={() => handleSave()}>Save Configuration</Button>
      </CardFooter>
    </Card>
  )
}
