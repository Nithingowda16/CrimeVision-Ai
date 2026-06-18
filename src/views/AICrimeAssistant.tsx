import React, { useState, useRef, useEffect } from 'react';
import { useIntelligence, type ChatMessage } from '../context/IntelligenceContext';
import { Send, Brain, ShieldAlert, Award, FileText, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export const AICrimeAssistant: React.FC = () => {
  const { chatHistory, sendChatMessage } = useIntelligence();
  const [inputMessage, setInputMessage] = useState('');
  const [activeInspectMsg, setActiveInspectMsg] = useState<ChatMessage | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Set inspectors to inspect the latest AI message if exists
    const aiMsgs = chatHistory.filter(m => m.sender === 'ai');
    if (aiMsgs.length > 0) {
      setActiveInspectMsg(aiMsgs[aiMsgs.length - 1]);
    }
  }, [chatHistory]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendChatMessage(inputMessage);
    setInputMessage('');
  };

  const selectSuggested = (query: string) => {
    sendChatMessage(query);
  };

  const suggestedQueries = [
    'Show repeat offenders linked to cybercrime in Bengaluru.',
    'Find all theft incidents connected through the same phone number.',
    'Which districts are likely to experience a spike in vehicle theft next month?'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Left Pane: Conversational Box */}
      <div className="lg:col-span-2 glass-panel rounded-xl flex flex-col overflow-hidden h-full">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-800 bg-gray-900/40 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-ksp-primary/10 border border-ksp-primary/30 rounded-lg text-ksp-primary">
              <Brain className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Cognitive Crime Assistant</h3>
              <p className="text-xs text-ksp-accent font-mono">Gemini 2.5 Pro Agent Core v4.1</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ksp-success/15 border border-ksp-success/30 text-ksp-success uppercase tracking-wider font-semibold">
            Context Synced
          </span>
        </div>

        {/* Suggested Queries Header */}
        <div className="px-5 py-3 bg-gray-900/20 border-b border-gray-800/80 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-ksp-muted font-mono flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" /> Prompt templates:
          </span>
          {suggestedQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => selectSuggested(q)}
              className="text-[11px] bg-ksp-primary/5 hover:bg-ksp-primary/15 border border-ksp-primary/20 hover:border-ksp-primary/40 text-gray-200 px-3 py-1 rounded-full transition text-left"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Feed */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              onClick={() => msg.sender === 'ai' && setActiveInspectMsg(msg)}
              className={`flex flex-col max-w-[85%] rounded-xl p-4 transition border ${
                msg.sender === 'user'
                  ? 'ml-auto bg-ksp-primary/10 border-ksp-primary/30 text-gray-100 rounded-br-none'
                  : `mr-auto bg-gray-800/40 border-gray-800/80 text-gray-200 rounded-bl-none cursor-pointer hover:border-ksp-primary/30 ${
                      activeInspectMsg?.id === msg.id ? 'border-ksp-accent/50 bg-gray-800/60' : ''
                    }`
              }`}
            >
              <div className="flex justify-between items-center mb-1 text-[10px] font-mono opacity-60">
                <span className="font-bold">{msg.sender === 'user' ? 'INVESTIGATOR' : 'CRIMEVISION AI'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>

              {msg.sender === 'ai' && msg.confidence && (
                <div className="mt-3 pt-2 border-t border-gray-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-ksp-accent hover:underline flex items-center gap-0.5">
                    Click to inspect reasoning path
                  </span>
                  <span className="text-ksp-success">Confidence: {msg.confidence}%</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-800 bg-gray-900/30 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Query intelligence repository (e.g. Find links between suspects...)"
            className="flex-1 bg-gray-950 text-xs sm:text-sm text-gray-200 border border-gray-800 focus:border-ksp-primary rounded-lg px-4 py-3 outline-none transition font-sans"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-ksp-primary hover:bg-ksp-primary/80 text-white rounded-lg transition-all flex items-center justify-center shadow-neon-blue active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Right Pane: Explainable AI Inspector */}
      <div className="glass-panel rounded-xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-800 bg-gray-900/40 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-ksp-accent animate-pulse" />
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Explainable AI Inspector</h3>
        </div>

        {activeInspectMsg ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Confidence Metric */}
            {activeInspectMsg.confidence && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-ksp-muted font-bold uppercase">Confidence Index</span>
                  <span className="text-ksp-success font-semibold">{activeInspectMsg.confidence}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-ksp-primary to-ksp-success transition-all duration-500"
                    style={{ width: `${activeInspectMsg.confidence}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Evidence List */}
            {activeInspectMsg.evidence && activeInspectMsg.evidence.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs text-ksp-muted font-mono font-bold uppercase flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-ksp-warning" /> Evidentiary Telemetry
                </h4>
                <div className="space-y-2">
                  {activeInspectMsg.evidence.map((ev, i) => (
                    <div key={i} className="text-xs p-2.5 bg-gray-950 border border-gray-900 rounded-lg text-gray-300">
                      {ev}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Decision Path Tree */}
            {activeInspectMsg.reasoningSteps && activeInspectMsg.reasoningSteps.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs text-ksp-muted font-mono font-bold uppercase flex items-center gap-1.5">
                  <Brain className="h-3.5 w-3.5 text-ksp-primary" /> Cognitive Decision Tree
                </h4>
                <div className="relative pl-4 border-l border-gray-800 space-y-4">
                  {activeInspectMsg.reasoningSteps.map((step, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[21px] top-1 bg-ksp-bg border border-ksp-primary/50 text-[10px] font-mono text-ksp-accent w-4 h-4 rounded-full flex items-center justify-center">
                        {i + 1}
                      </div>
                      <p className="text-xs text-gray-300 pl-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources cited */}
            {activeInspectMsg.sources && activeInspectMsg.sources.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs text-ksp-muted font-mono font-bold uppercase flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-ksp-accent" /> Knowledge Repositories
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeInspectMsg.sources.map((src, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-gray-900 border border-gray-800 text-ksp-accent rounded">
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested actions */}
            {activeInspectMsg.suggestedActions && activeInspectMsg.suggestedActions.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-gray-800">
                <h4 className="text-xs text-ksp-muted font-mono font-bold uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-ksp-success" /> Recommended Vector Action
                </h4>
                <div className="space-y-1.5">
                  {activeInspectMsg.suggestedActions.map((act, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-gray-300">
                      <ChevronRight className="h-3.5 w-3.5 text-ksp-accent flex-shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-ksp-muted">
            <Brain className="h-10 w-10 text-gray-800 mb-2" />
            <p className="text-xs">No AI agent decision path has been parsed. Submit a query to initiate analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
};
