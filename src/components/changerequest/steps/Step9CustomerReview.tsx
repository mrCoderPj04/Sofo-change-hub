import React, { useState } from 'react';
import { ChangeRequest, Comment } from '@/types';
import { Users, Send, CheckCircle2, MessageSquare, Building2 } from 'lucide-react';
import { CURRENT_USER, MOCK_USERS } from '@/data/mockData';

interface Step9Props {
  cr: ChangeRequest;
  onAddComment?: (text: string) => void;
}

export const Step9CustomerReview: React.FC<Step9Props> = ({ cr, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(cr.comments || []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      author: CURRENT_USER,
      content: commentText,
      createdAt: new Date().toISOString(),
      stage: 'customer_review',
      isInternal: false,
    };

    setComments([...comments, newComment]);
    setCommentText('');
    if (onAddComment) onAddComment(commentText);
  };

  return (
    <div className="space-y-4">
      <div className="bg-surface-secondary/40 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Stage 09: Customer Staging Review & Feedback Channel
            </h4>
          </div>
          <span className="text-[11px] text-text-muted">
            Client: <span className="text-text-primary font-medium">{cr.clientName}</span>
          </span>
        </div>

        {/* Staging environment banner */}
        <div className="p-3 bg-surface rounded border border-border mb-4 flex items-center justify-between text-xs">
          <div>
            <span className="text-text-muted text-[11px] block">Customer Sandbox Endpoint:</span>
            <span className="font-code text-cyan-300 font-medium">
              https://apex-staging.pjsofonic.com/ledger/preview
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-[10px] font-code">
            Active Tenant Sandbox
          </span>
        </div>

        {/* Discussion Timeline */}
        <div className="space-y-3 mb-4">
          {comments.map((comm) => (
            <div key={comm.id} className="p-3 bg-surface rounded border border-border flex gap-3 text-xs">
              <img
                src={comm.author.avatar}
                alt={comm.author.name}
                className="w-7 h-7 rounded-full object-cover border border-border shrink-0 mt-0.5"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{comm.author.name}</span>
                    <span className="text-[10px] text-text-muted">({comm.author.role})</span>
                  </div>
                  <span className="text-[10px] font-code text-text-muted">
                    {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed font-sans">{comm.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply form */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Post client review feedback or operational question..."
            className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-accent hover:bg-accent-hover text-[#07090D] font-semibold text-xs rounded-md shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
