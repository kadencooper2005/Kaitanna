"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Heart,
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  LogOut,
  Search,
  MoreVertical,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  createJournalEntry,
  getUserJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
  isSupabaseAvailable,
  type JournalEntry,
} from "@/lib/supabase";
import { format } from "date-fns";

export default function JournalPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Form states
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    loadJournalEntries();
  }, [user, router]);

  const loadJournalEntries = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const userEntries = await getUserJournalEntries(user.id);
      setEntries(userEntries);
    } catch (error) {
      console.error("Error loading journal entries:", error);
      setError("Failed to load journal entries. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEntry = async () => {
    if (!user || !newEntryTitle.trim() || !newEntryContent.trim()) return;

    setIsSaving(true);
    setError(null);
    try {
      const newEntry = await createJournalEntry(
        user.id,
        newEntryTitle,
        newEntryContent
      );
      if (newEntry) {
        setEntries([newEntry, ...entries]);
        setNewEntryTitle("");
        setNewEntryContent("");
        setIsNewEntryDialogOpen(false);
      } else {
        setError("Failed to create journal entry. Please try again.");
      }
    } catch (error) {
      console.error("Error creating journal entry:", error);
      setError("Failed to create journal entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setIsEditDialogOpen(true);
  };

  const handleUpdateEntry = async () => {
    if (!selectedEntry || !editTitle.trim() || !editContent.trim()) return;

    setIsSaving(true);
    setError(null);
    try {
      const updatedEntry = await updateJournalEntry(
        selectedEntry.id,
        editTitle,
        editContent
      );
      if (updatedEntry) {
        setEntries(
          entries.map((entry) =>
            entry.id === selectedEntry.id ? updatedEntry : entry
          )
        );
        setIsEditDialogOpen(false);
        setSelectedEntry(null);
      } else {
        setError("Failed to update journal entry. Please try again.");
      }
    } catch (error) {
      console.error("Error updating journal entry:", error);
      setError("Failed to update journal entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEntry) return;

    setIsSaving(true);
    setError(null);
    try {
      const success = await deleteJournalEntry(selectedEntry.id);
      if (success) {
        setEntries(entries.filter((entry) => entry.id !== selectedEntry.id));
        setIsDeleteDialogOpen(false);
        setSelectedEntry(null);
      } else {
        setError("Failed to delete journal entry. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      setError("Failed to delete journal entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  // Filter entries based on search term
  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-8 w-8 text-cyan-500 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your journal...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  const supabaseConnected = isSupabaseAvailable();

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-cyan-500" />
              <Link
                href="/dashboard"
                className="text-xl font-bold tracking-tight hover:text-cyan-500 transition-colors"
              >
                Kaitanna
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-cyan-500 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/mood-tracker"
                className="text-sm font-medium hover:text-cyan-500 transition-colors"
              >
                Mood Tracker
              </Link>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-500" />
                <span className="font-medium">Journal</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container py-8 md:py-12">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                  Your Journal
                </h1>
                <p className="text-xl text-muted-foreground">
                  Reflect on your thoughts and experiences
                </p>
              </div>
              <Button
                onClick={() => setIsNewEntryDialogOpen(true)}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </div>

            {/* Connection Status */}
            <div className="mb-4">
              <Badge
                variant="outline"
                className={`${
                  supabaseConnected
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}
              >
                {supabaseConnected ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Cloud sync enabled
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Local storage mode
                  </>
                )}
              </Badge>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Journal Entries */}
          <div className="grid gap-6">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className="group hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl mb-2 truncate">
                          {entry.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(entry.created_at), "MMM dd, yyyy")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(new Date(entry.created_at), "h:mm a")}
                          </div>
                          {entry.updated_at !== entry.created_at && (
                            <Badge variant="outline" className="text-xs">
                              Edited
                            </Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditEntry(entry)}
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteEntry(entry)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-muted-foreground whitespace-pre-wrap line-clamp-4">
                        {entry.content}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm
                      ? "No entries found"
                      : "Start your journaling journey"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms to find what you're looking for."
                      : "Create your first journal entry to begin reflecting on your thoughts and experiences."}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => setIsNewEntryDialogOpen(true)}
                      className="bg-cyan-500 hover:bg-cyan-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Write Your First Entry
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Stats Card */}
          {entries.length > 0 && (
            <Card className="mt-8 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Your Journaling Journey
                    </h3>
                    <p className="text-muted-foreground">
                      You've written {entries.length}{" "}
                      {entries.length === 1 ? "entry" : "entries"} so far. Keep
                      reflecting and growing!
                    </p>
                    {!supabaseConnected && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                        Note: Your entries are saved locally. Set up Supabase
                        for cloud sync.
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                      {entries.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entries.length === 1 ? "Entry" : "Entries"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* New Entry Dialog */}
      <Dialog
        open={isNewEntryDialogOpen}
        onOpenChange={setIsNewEntryDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Journal Entry</DialogTitle>
            <DialogDescription>
              Write about your thoughts, experiences, or anything on your mind.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="new-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="new-title"
                value={newEntryTitle}
                onChange={(e) => setNewEntryTitle(e.target.value)}
                placeholder="Give your entry a title..."
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="new-content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="new-content"
                value={newEntryContent}
                onChange={(e) => setNewEntryContent(e.target.value)}
                placeholder="What's on your mind today?"
                className="mt-1 min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewEntryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEntry}
              disabled={
                !newEntryTitle.trim() || !newEntryContent.trim() || isSaving
              }
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {isSaving ? "Saving..." : "Save Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Entry Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Journal Entry</DialogTitle>
            <DialogDescription>
              Make changes to your journal entry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Give your entry a title..."
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="edit-content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="What's on your mind today?"
                className="mt-1 min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateEntry}
              disabled={!editTitle.trim() || !editContent.trim() || isSaving}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {isSaving ? "Saving..." : "Update Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedEntry?.title}"? This
              action cannot be undone and your entry will be permanently lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSaving}
            >
              {isSaving ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
