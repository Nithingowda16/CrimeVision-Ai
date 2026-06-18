import React, { useState } from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { KSP_CASES } from '../mockData/intelligenceDb';
import { Briefcase, Search, FileText, CheckSquare, Plus, Trash } from 'lucide-react';

export const CaseWorkspace: React.FC = () => {
  const { selectedCase, setSelectedCase } = useIntelligence();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Case collaboration states (local persistence)
  const [notes, setNotes] = useState<Record<string, string[]>>({
    'CASE_2026_001': [
      'Note: Freezing order sent to Axis Bank compliance division.',
      'Note: Call records suggest co-accused was active in Mangaluru on the date of the heist.'
    ],
    'CASE_2026_002': [
      'Note: Forensics report confirmed signature forgery on registry deed.',
      'Note: Local inspector verified the presence of JCB excavators.'
    ]
  });

  const [tasks, setTasks] = useState<Record<string, { id: string; text: string; done: boolean }[]>>({
    'CASE_2026_001': [
      { id: 't1', text: 'Obtain certified bank transfer trail logs', done: true },
      { id: 't2', text: 'Trace Monero mixer exit addresses', done: false },
      { id: 't3', text: 'Coordinate arrest warrant for Tech Murali in Jayanagar', done: false }
    ],
    'CASE_2026_002': [
      { id: 't4', text: 'Subregistrar registration seal audit', done: true },
      { id: 't5', text: 'Interview local highway eyewitnesses', done: false }
    ]
  });

  const [newNote, setNewNote] = useState('');
  const [newTask, setNewTask] = useState('');

  const activeCase = selectedCase || KSP_CASES[0];

  const filteredCases = KSP_CASES.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  // Notes management
  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => ({
      ...prev,
      [activeCase.id]: [...(prev[activeCase.id] || []), newNote.trim()]
    }));
    setNewNote('');
  };

  const deleteNote = (index: number) => {
    setNotes((prev) => {
      const copy = { ...prev };
      copy[activeCase.id].splice(index, 1);
      return copy;
    });
  };

  // Task management
  const addTask = () => {
    if (!newTask.trim()) return;
    const item = {
      id: `task_${Date.now()}`,
      text: newTask.trim(),
      done: false
    };
    setTasks((prev) => ({
      ...prev,
      [activeCase.id]: [...(prev[activeCase.id] || []), item]
    }));
    setNewTask('');
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) => {
      const copy = { ...prev };
      copy[activeCase.id] = (copy[activeCase.id] || []).map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      );
      return copy;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
      {/* Sidebar Cases Browser */}
      <div className="glass-panel p-4 rounded-xl flex flex-col gap-4 overflow-y-auto">
        <div className="pb-3 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">KSP Cases</h3>
            <p className="text-[10px] text-ksp-muted font-mono">Select case file to audit</p>
          </div>
          <button className="p-1 bg-ksp-primary/10 border border-ksp-primary/30 rounded text-ksp-primary hover:bg-ksp-primary/20 transition">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-ksp-muted" />
            <input
              type="text"
              placeholder="Search case # / title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 text-xs border border-gray-850 rounded px-8 py-2 outline-none focus:border-ksp-primary text-gray-300"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-gray-950 text-xs border border-gray-800 rounded px-2.5 py-1.5 outline-none text-gray-300 focus:border-ksp-primary"
          >
            <option value="ALL">All Categories</option>
            <option value="Cyber Crime">Cyber Crime</option>
            <option value="Land Grabbing">Land Grabbing</option>
            <option value="Financial Fraud">Financial Fraud</option>
          </select>
        </div>

        {/* Case List */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                activeCase.id === c.id
                  ? 'bg-ksp-primary/15 border-ksp-primary text-white shadow-neon-blue'
                  : 'bg-gray-950 border-gray-850 text-gray-400 hover:border-gray-800'
              }`}
            >
              <div className="flex justify-between items-center mb-1 font-mono text-[9px]">
                <span className="font-semibold text-ksp-accent">{c.caseNumber}</span>
                <span className={`px-1 rounded text-[8px] font-bold ${
                  c.threatLevel === 'CRITICAL' ? 'bg-ksp-danger/20 text-ksp-danger' : 'bg-ksp-warning/20 text-ksp-warning'
                }`}>
                  {c.threatLevel}
                </span>
              </div>
              <h4 className="font-bold text-gray-200 line-clamp-1">{c.title}</h4>
              <div className="flex justify-between items-center text-[10px] text-ksp-muted font-mono mt-2 pt-2 border-t border-gray-900/60">
                <span>{c.district.split(' ')[0]}</span>
                <span>{c.reportedDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Workspace Dashboard */}
      <div className="lg:col-span-2 glass-panel rounded-xl overflow-hidden flex flex-col h-full bg-gray-950/10 border border-gray-850">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-850 bg-gray-900/40 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-ksp-primary animate-pulse" />
            <div>
              <h3 className="font-bold text-sm text-white">{activeCase.title}</h3>
              <p className="text-[10px] font-mono text-ksp-accent">{activeCase.caseNumber} | {activeCase.station}</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
            activeCase.status === 'INVESTIGATING' ? 'bg-ksp-primary/20 text-ksp-accent border border-ksp-primary/30' : 'bg-ksp-success/20 text-ksp-success'
          }`}>
            {activeCase.status}
          </span>
        </div>

        {/* Body scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Summary Panel */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-ksp-muted font-bold tracking-wider">Executive Investigation Brief</span>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-gray-950/60 p-4 border border-gray-900 rounded-lg">
              {activeCase.summary}
            </p>
          </div>

          {/* Evidence Board (Highly visual) */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-ksp-muted font-bold tracking-wider">Evidence Locker (Digital & Physical)</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeCase.evidenceItems.map((ev) => (
                <div key={ev.id} className="p-3 bg-gray-950 border border-gray-900 rounded-lg flex flex-col justify-between hover:border-ksp-accent/50 transition">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-xs font-bold text-gray-200 leading-tight">{ev.name}</span>
                    <FileText className="h-4 w-4 text-ksp-accent flex-shrink-0" />
                  </div>
                  <div className="mt-4 pt-2 border-t border-gray-900 text-[9px] font-mono text-ksp-muted flex justify-between items-center">
                    <span>{ev.type}</span>
                    <span className="text-ksp-success">Verify: {ev.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Timeline */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-mono uppercase text-ksp-muted font-bold tracking-wider">Investigation Milestone Timeline</span>
            <div className="relative border-l border-gray-800 pl-4 ml-2 space-y-4">
              {activeCase.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-ksp-accent border border-ksp-bg rounded-full"></div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-baseline gap-2 font-mono text-[10px] font-bold text-ksp-accent">
                      <span>{item.date}</span>
                      <span className="text-ksp-muted">Officer: {item.officer}</span>
                    </div>
                    <span className="text-xs font-bold text-white mt-1">{item.title}</span>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Sidebar (Notes and Tasks) */}
      <div className="glass-panel p-5 rounded-xl flex flex-col gap-5 overflow-y-auto">
        {/* Notes Pad */}
        <div className="space-y-3 flex-1 flex flex-col min-h-0">
          <div className="pb-2 border-b border-gray-850">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Case Notes</h4>
            <p className="text-[9px] text-ksp-muted">Simulated collaborative notepad</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {(notes[activeCase.id] || []).map((note, index) => (
              <div key={index} className="p-2.5 bg-gray-950 border border-gray-900 text-[11px] text-gray-300 rounded relative group">
                <p className="leading-relaxed pr-6">{note}</p>
                <button
                  onClick={() => deleteNote(index)}
                  className="absolute right-2 top-2 text-ksp-danger opacity-0 group-hover:opacity-100 transition hover:scale-110"
                >
                  <Trash className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 mt-2">
            <input
              type="text"
              placeholder="Add investigator note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 bg-gray-950 text-xs border border-gray-850 rounded px-2.5 py-1.5 outline-none text-gray-300"
            />
            <button
              onClick={addNote}
              className="bg-ksp-primary hover:bg-ksp-primary/80 text-white p-1.5 rounded transition flex items-center justify-center"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tasks Checklist */}
        <div className="space-y-3 flex-1 flex flex-col min-h-0 pt-3 border-t border-gray-850">
          <div className="pb-2 border-b border-gray-850">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Lead Tasks Checklist</h4>
            <p className="text-[9px] text-ksp-muted">Actions pending assignment</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {(tasks[activeCase.id] || []).map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-2 bg-gray-950 border border-gray-900 rounded text-xs flex items-center gap-2 cursor-pointer transition select-none ${
                  task.done ? 'opacity-50 border-gray-900/60' : 'hover:border-ksp-accent/40'
                }`}
              >
                <CheckSquare className={`h-4.5 w-4.5 ${task.done ? 'text-ksp-success' : 'text-gray-600'}`} />
                <span className={`text-[11px] leading-tight text-gray-300 ${task.done ? 'line-through' : ''}`}>{task.text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 mt-2">
            <input
              type="text"
              placeholder="Create investigation task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 bg-gray-950 text-xs border border-gray-850 rounded px-2.5 py-1.5 outline-none text-gray-300"
            />
            <button
              onClick={addTask}
              className="bg-ksp-accent hover:bg-ksp-accent/80 text-white p-1.5 rounded transition flex items-center justify-center"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
