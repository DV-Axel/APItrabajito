import { supabase } from "./supabaseClient.js";

import fs from "fs";


export async function uploadToSupabase({ bucket, filePath, destinationPath, mimetype }) {
    const fileBuffer = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(destinationPath, fileBuffer, {
            contentType: mimetype,
            upsert: true
        });

    fs.unlinkSync(filePath);

    if (error) throw new Error(error.message);

    const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(destinationPath);

    return publicUrlData.publicUrl;
}