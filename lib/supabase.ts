import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our chat data
export interface ChatMessage {
    id: string
    user_id: string
    content: string
    sender: "user" | "kaitanna"
    sentiment?: string
    created_at: string
    updated_at: string
}

export interface ChatSession {
    id: string
    user_id: string
    title: string
    created_at: string
    updated_at: string
    last_message_at: string
}
