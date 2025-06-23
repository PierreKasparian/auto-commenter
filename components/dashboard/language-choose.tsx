"use client";

import type React from "react";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { saveLanguages } from "@/utils/supabase/queries";
import { languagesSupported } from "@/utils/helpers";
import { toastStatusPop, toastErrorPop } from "@/utils/helpers";

export default function LanguageChoose({
  unipileId,
  langues,
}: {
  unipileId: string;
  langues: string[];
}) {
  const [languages, setLanguages] = useState<string>(langues[0] ?? "fr");
  const [newLanguage, setNewLanguage] = useState("");

  const addLanguage = async () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages(newLanguage.trim());
      setNewLanguage("");
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    setLanguages(languageToRemove);
  };

  const handleSave = async () => {
    const result = await saveLanguages([languages], unipileId)
    if (result.success) {
      toastStatusPop("Success ! 🎉", "Your languages have been successfully saved")
    }else{
      toastErrorPop("Error", "Failed to save languages")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black">
          Language selector
        </CardTitle>
        <CardDescription>
          Restrict your target posts to these languages. If no recent posts of these languages are found, default language will be english.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Select onValueChange={setNewLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Language</SelectLabel>
                {languagesSupported.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={addLanguage}
            disabled={!newLanguage.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        <div className="min-h-20 p-3 border rounded-md bg-muted/40">
          {languages.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {[languages].map((language) => (
                <Badge key={language} variant="secondary" className="px-2 py-1">
                  {language}
                  <button
                    onClick={() => removeLanguage(language)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No languages added yet. Every languages are enabled.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setLanguages("en")}>Reset</Button>
        <Button
          type="button"
          onClick={() => handleSave()}
        >
          Save Configuration
        </Button>
      </CardFooter>
    </Card>
  );
}
