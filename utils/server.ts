"use server"

import { createClient } from "./supabase/server";

export const generateSummary = async (text: string,id:string) => {
    const response = await fetch(process.env.NEXT_ENV == "development" ? "http://localhost:3000/api/summarize" : "https://auto-commenter.vercel.app/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TRIG_TASK_KEY}`,
      },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    if (data){
        const supabase = await createClient();
        const { error } = await supabase.from("comment_proposal").update({IA_summarize:data}).eq("id",id)
        if (error){
            console.log(error)
        }
    }
    return data || "Résumé non disponible";
  };