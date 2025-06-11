import { createClient } from "@supabase/supabase-js"

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create Supabase client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Types for our data
export interface Profile {
    id: string
    username: string
    email: string
    created_at: string
    updated_at: string
}

export interface JournalEntry {
    id: string
    user_id: string
    title: string
    content: string
    created_at: string
    updated_at: string
}

// Profile functions
export async function createProfile(userId: string, username: string, email: string): Promise<Profile | null> {
    if (!supabase) return null

    try {
        const { data, error } = await supabase
            .from("profiles")
            .insert([
                {
                    id: userId,
                    username,
                    email,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ])
            .select()
            .single()

        if (error) {
            console.error("Error creating profile:", error)
            return null
        }

        return data
    } catch (error) {
        console.error("Error creating profile:", error)
        return null
    }
}

export async function getProfile(userId: string): Promise<Profile | null> {
    if (!supabase) return null

    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single()

        if (error) {
            console.error("Error fetching profile:", error)
            return null
        }

        return data
    } catch (error) {
        console.error("Error fetching profile:", error)
        return null
    }
}

export async function updateProfile(
    userId: string,
    updates: Partial<Profile>
): Promise<Profile | null> {
    if (!supabase) return null

    try {
        const { data, error } = await supabase
            .from("profiles")
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq("id", userId)
            .select()
            .single()

        if (error) {
            console.error("Error updating profile:", error)
            return null
        }

        return data
    } catch (error) {
        console.error("Error updating profile:", error)
        return null
    }
}

// Local storage fallback key
const JOURNAL_STORAGE_KEY = "kaitanna-journal-entries"

// Local storage fallback functions
function getLocalJournalEntries(): JournalEntry[] {
    if (typeof window === "undefined") return []

    try {
        const stored = localStorage.getItem(JOURNAL_STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error("Error loading local journal entries:", error)
        return []
    }
}

function saveLocalJournalEntries(entries: JournalEntry[]): void {
    if (typeof window === "undefined") return

    try {
        localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries))
    } catch (error) {
        console.error("Error saving local journal entries:", error)
    }
}

// Database functions for journal entries with localStorage fallback
export async function createJournalEntry(userId: string, title: string, content: string): Promise<JournalEntry | null> {
    const newEntry: JournalEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        title: title.trim(),
        content: content.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    // Try Supabase first if available
    if (supabase) {
        try {
            const { data, error } = await supabase.from("journal_entries").insert([newEntry]).select().single()

            if (error) {
                console.warn("Supabase error, falling back to localStorage:", error)
                // Fall back to localStorage
                const entries = getLocalJournalEntries()
                entries.unshift(newEntry)
                saveLocalJournalEntries(entries)
                return newEntry
            }

            return data
        } catch (error) {
            console.warn("Supabase connection error, falling back to localStorage:", error)
            // Fall back to localStorage
            const entries = getLocalJournalEntries()
            entries.unshift(newEntry)
            saveLocalJournalEntries(entries)
            return newEntry
        }
    }

    // Use localStorage if Supabase is not available
    const entries = getLocalJournalEntries()
    entries.unshift(newEntry)
    saveLocalJournalEntries(entries)
    return newEntry
}

export async function getUserJournalEntries(userId: string): Promise<JournalEntry[]> {
    // Try Supabase first if available
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from("journal_entries")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })

            if (error) {
                console.warn("Supabase error, falling back to localStorage:", error)
                // Fall back to localStorage
                return getLocalJournalEntries().filter((entry) => entry.user_id === userId)
            }

            return data || []
        } catch (error) {
            console.warn("Supabase connection error, falling back to localStorage:", error)
            // Fall back to localStorage
            return getLocalJournalEntries().filter((entry) => entry.user_id === userId)
        }
    }

    // Use localStorage if Supabase is not available
    return getLocalJournalEntries().filter((entry) => entry.user_id === userId)
}

export async function updateJournalEntry(
    entryId: string,
    title: string,
    content: string,
): Promise<JournalEntry | null> {
    const updatedData = {
        title: title.trim(),
        content: content.trim(),
        updated_at: new Date().toISOString(),
    }

    // Try Supabase first if available
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from("journal_entries")
                .update(updatedData)
                .eq("id", entryId)
                .select()
                .single()

            if (error) {
                console.warn("Supabase error, falling back to localStorage:", error)
                // Fall back to localStorage
                const entries = getLocalJournalEntries()
                const entryIndex = entries.findIndex((entry) => entry.id === entryId)
                if (entryIndex !== -1) {
                    entries[entryIndex] = { ...entries[entryIndex], ...updatedData }
                    saveLocalJournalEntries(entries)
                    return entries[entryIndex]
                }
                return null
            }

            return data
        } catch (error) {
            console.warn("Supabase connection error, falling back to localStorage:", error)
            // Fall back to localStorage
            const entries = getLocalJournalEntries()
            const entryIndex = entries.findIndex((entry) => entry.id === entryId)
            if (entryIndex !== -1) {
                entries[entryIndex] = { ...entries[entryIndex], ...updatedData }
                saveLocalJournalEntries(entries)
                return entries[entryIndex]
            }
            return null
        }
    }

    // Use localStorage if Supabase is not available
    const entries = getLocalJournalEntries()
    const entryIndex = entries.findIndex((entry) => entry.id === entryId)
    if (entryIndex !== -1) {
        entries[entryIndex] = { ...entries[entryIndex], ...updatedData }
        saveLocalJournalEntries(entries)
        return entries[entryIndex]
    }
    return null
}

export async function deleteJournalEntry(entryId: string): Promise<boolean> {
    // Try Supabase first if available
    if (supabase) {
        try {
            const { error } = await supabase.from("journal_entries").delete().eq("id", entryId)

            if (error) {
                console.warn("Supabase error, falling back to localStorage:", error)
                // Fall back to localStorage
                const entries = getLocalJournalEntries()
                const filteredEntries = entries.filter((entry) => entry.id !== entryId)
                saveLocalJournalEntries(filteredEntries)
                return true
            }

            return true
        } catch (error) {
            console.warn("Supabase connection error, falling back to localStorage:", error)
            // Fall back to localStorage
            const entries = getLocalJournalEntries()
            const filteredEntries = entries.filter((entry) => entry.id !== entryId)
            saveLocalJournalEntries(filteredEntries)
            return true
        }
    }

    // Use localStorage if Supabase is not available
    const entries = getLocalJournalEntries()
    const filteredEntries = entries.filter((entry) => entry.id !== entryId)
    saveLocalJournalEntries(filteredEntries)
    return true
}

// Helper function to check if Supabase is available
export function isSupabaseAvailable(): boolean {
    return supabase !== null
}
