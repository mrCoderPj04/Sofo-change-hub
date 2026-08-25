import React, { useState } from 'react';
import { ChangeRequest, Comment } from '@/types';
import { Users, Send, CheckCircle2, MessageSquare, Building2, User } from 'lucide-react';

interface Step9Props {
  cr: ChangeRequest;
  currentUser?: {
    displayName?: string;
    username?: string;
    employeeId?: string;
    organization?: string;
  } | null;
  onAddComment?: (text: string) => void;
}

export const Step9CustomerReview: React.FC<Step9Props> = ({ cr, currentUser, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(cr.comments || []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const authorUser = {
      id: currentUser?.employeeId || 'usr-client',
      name: currentUser?.displayName || currentUser?.username || cr.clientName || 'Customer Signatory',
      email: 'client@apexfinancials.com',
      role: 'Client Contact',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      organization: cr.clientName,
    };

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      author: authorUser,
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
              Stage 09: Customer Staging Review &amp; Feedback Channel
            </h4>
          </div>
          <span className="text-[11px] text-text-muted">
            Client: <span className="text-text-primary font-medium">{cr.clientName}</span>
          </span>
        </div>

        {/* Feedback List */}
        <div className="space-y-3 mb-4">
          {comments.length === 0 ? (
            <div className="p-6 text-center text-text-muted text-xs bg-surface rounded border border-border">
              <MessageSquare className="w-6 h-6 text-text-muted mx-auto mb-2 opacity-50" />
              <p className="font-medium text-text-secondary">No customer feedback comments yet</p>
              <p className="text-[11px] text-text-muted mt-0.5">
                Type a message below to submit feedback for this change request.
              </p>
            </div>
          ) : (
            comments.map((comm) => (
              <div key={comm.id} className="p-3 bg-surface rounded border border-border flex gap-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-accent shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">{comm.author?.name || 'User'}</span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(comm.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-text-secondary leading-relaxed">{comm.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment input form */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type customer staging feedback notes..."
            className="flex-1 bg-surface border border-border rounded px-3 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
