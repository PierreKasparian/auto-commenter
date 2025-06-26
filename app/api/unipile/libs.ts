import { createClient } from "@/utils/supabase/server";
import { getProviderId } from "@/utils/unipile/queries";
import { getProfilDesc } from "@/utils/unipile/queries";
import { NextResponse } from "next/server";
import { getUserComments } from "@/utils/unipile/queries";
import { qdrantSavePost, qdrantUpdateUnipileId } from "@/utils/qdrant/queries";
import { getPostFromId } from "@/utils/unipile/queries";
export async function onSuccessConnect(user_id: string, unipile_id: string) {
  const supabase = await createClient();
  const provider_id = await getProviderId(unipile_id);
  console.log("provider_id", provider_id);
  const { profileDescription, profileName } = await getProfilDesc(
    unipile_id,
    provider_id
  );
  console.log(profileDescription);
  const { error: unipileError } = await supabase.from("unipile_id").insert({
    unipile_id: unipile_id,
    user_id: user_id,
    com_per_day_max: 4, //a changer
    profile_description: profileDescription ?? "",
    profile_name: profileName,
  });
  if (unipileError) {
    console.log(unipileError);
    return NextResponse.json({
      status: "error",
      message: "Error connecting your account",
    });
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const comments = await getUserComments(unipile_id, provider_id);
    console.log("comments", comments);
    for (const comment of comments.items.slice(0, 20)) {
      if (comment.text.length > 15 && comment.author === profileName) {
        const post = await getPostFromId(comment.post_urn, unipile_id);
        await qdrantSavePost(post.text, comment.text, unipile_id);
        await new Promise((resolve) => setTimeout(resolve, 1)); //ids are time generated}
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "error",
      message: "Error connecting your account",
    });
  }
  return NextResponse.json({
    status: "success",
    message: "Your account has been successfully connected",
  });
}

export async function fuckUnipile(
  old_unipile_id: string,
  new_unipile_id: string,
  user_id: string
) {
  console.log("fuckUnipile");
  await qdrantUpdateUnipileId(old_unipile_id, new_unipile_id);
  const supabase = await createClient();
  const { error: unipileError } = await supabase
    .from("unipile_id")
    .update({
      unipile_id: new_unipile_id,
    })
    .eq("user_id", user_id);
  if (unipileError) {
    console.log(unipileError);
    return NextResponse.json({
      status: "error",
      message: "Error connecting your account",
    }, { status: 500 });
  }
  return NextResponse.json({
    status: "success",
    message: "Your account has been successfully connected",
  }, { status: 200 });
}
