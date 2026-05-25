import { useGetNotes, useCreateNote } from "@workspace/api-client-react";
import { FileText, Plus } from "lucide-react";
import { useState } from "react";

export default function Notes() {
  const { data: notes } = useGetNotes();
  const createMutation = useCreateNote();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!title || !content) return;
    createMutation.mutate({ data: { title, content, tags: 'manual' } });
    setTitle("");
    setContent("");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <div className="w-1/3 glass-panel rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-primary/20 flex items-center justify-between">
          <h2 className="font-heading text-lg text-primary">DATA REPOSITORY</h2>
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notes?.map(note => (
            <div key={note.id} className="p-3 bg-[#020817]/60 border border-primary/20 rounded cursor-pointer hover:border-primary transition-colors">
              <h3 className="font-medium text-foreground truncate">{note.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 truncate">{note.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-primary/20 flex items-center justify-between bg-primary/5">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title..."
            className="bg-transparent border-none focus:outline-none font-heading text-xl text-primary w-full"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Input data stream..."
          className="flex-1 p-6 bg-transparent border-none focus:outline-none resize-none font-mono text-sm leading-relaxed"
        />
        <div className="p-4 border-t border-primary/20 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={!title || !content}
            className="flex items-center gap-2 px-6 py-2 bg-primary/20 text-primary border border-primary hover:bg-primary/40 rounded font-heading transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            STORE
          </button>
        </div>
      </div>
    </div>
  );
}
