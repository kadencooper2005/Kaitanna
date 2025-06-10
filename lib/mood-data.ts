export interface MoodEntry {
    id: string
    mood: string
    note?: string
    date: string
    userId: string // Add userId to associate moods with users
}

const STORAGE_KEY = "kaitanna-mood-entries"

// Get all mood entries (for admin purposes)
export function getAllMoodEntries(): MoodEntry[] {
    if (typeof window === "undefined") return []

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error("Error loading mood entries:", error)
        return []
    }
}

// Get mood entries for a specific user
export function getUserMoodEntries(userId: string): MoodEntry[] {
    const allEntries = getAllMoodEntries()
    return allEntries.filter((entry) => entry.userId === userId)
}

// Legacy function for backward compatibility (now returns empty array)
export function getMoodEntries(): MoodEntry[] {
    // This function is deprecated - use getUserMoodEntries instead
    return []
}

// Add mood entry for a specific user
export function addUserMoodEntry(userId: string, mood: string, note?: string): MoodEntry {
    const entry: MoodEntry = {
        id: Date.now().toString(),
        mood,
        note,
        date: new Date().toISOString(),
        userId,
    }

    const allEntries = getAllMoodEntries()

    // Remove any existing entry for today for this user
    const today = new Date().toDateString()
    const filteredEntries = allEntries.filter((e) => !(e.userId === userId && new Date(e.date).toDateString() === today))

    const updatedEntries = [entry, ...filteredEntries]

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries))
    } catch (error) {
        console.error("Error saving mood entry:", error)
    }

    return entry
}

// Legacy function for backward compatibility
export function addMoodEntry(mood: string, note?: string): MoodEntry {
    // This function is deprecated - use addUserMoodEntry instead
    throw new Error("addMoodEntry is deprecated. Use addUserMoodEntry instead.")
}

// Delete mood entry for a specific user
export function deleteUserMoodEntry(userId: string, entryId: string): void {
    const allEntries = getAllMoodEntries()
    const updatedEntries = allEntries.filter((entry) => !(entry.id === entryId && entry.userId === userId))

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries))
    } catch (error) {
        console.error("Error deleting mood entry:", error)
    }
}

// Legacy function for backward compatibility
export function deleteMoodEntry(id: string): void {
    // This function is deprecated - use deleteUserMoodEntry instead
    throw new Error("deleteMoodEntry is deprecated. Use deleteUserMoodEntry instead.")
}