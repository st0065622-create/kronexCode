import React, { useState, useEffect } from 'react';
import { TUTORIALS } from '../data';
import { Tutorial, UserProgress } from '../types';
import { 
  Play, CheckCircle, AlertTriangle, Lightbulb, RefreshCw, 
  Terminal, Sparkles, Code, BrainCircuit, ChevronRight, Award 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TutorialWorkspaceProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void;
}

export default function TutorialWorkspace({ progress, onUpdateProgress }: TutorialWorkspaceProps) {
  const [activeTutorialId, setActiveTutorialId] = useState(TUTORIALS[0].id);
  const [codeValue, setCodeValue] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [successState, setSuccessState] = useState<'idle' | 'success' | 'failure'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [solvedInSession, setSolvedInSession] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'instructions' | 'editor'>('instructions');

  // Find active tutorial
  const activeTutorial = TUTORIALS.find(t => t.id === activeTutorialId) || TUTORIALS[0];

  // Initialize workspace when active tutorial shifts
  useEffect(() => {
    setCodeValue(activeTutorial.initialCode);
    setConsoleOutput(['Console initialized. Ready to execute code.']);
    setSuccessState('idle');
    setFeedbackMsg('');
    setShowHint(null);
    setSolvedInSession(false);
  }, [activeTutorialId]);

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput(prev => [...prev, `> Executing ${activeTutorial.title} code...`]);
    
    setTimeout(() => {
      setIsRunning(false);
      // Construct a simulated output log based on the active lesson content
      let simulatedLogs: string[] = [];
      const userText = codeValue.toLowerCase();

      if (activeTutorial.id === 'prompting-1') {
        if (userText.includes('json') && (userText.includes('classifier') || userText.includes('sentiment'))) {
          simulatedLogs = [
            'System Instruction Loaded successfully.',
            'Evaluating validation prompt constraints...',
            'Result output matches schema template:',
            '{\n  "sentiment": "positive",\n  "score": 0.94\n}',
            'Tests passed: Output format matches required json constraint!'
          ];
        } else {
          simulatedLogs = [
            'System Instruction Loaded successfully.',
            'Warning: Model response failed JSON strict format validation.',
            'Output: "Sure, here is your classification: This text is positive!"',
            'Error: Non-JSON conversational filler detected.'
          ];
        }
      } else if (activeTutorial.id === 'python-1') {
        if (userText.includes('def clamp_temperature') && userText.includes('return 1.0') && userText.includes('return 0.0')) {
          simulatedLogs = [
            'python test_runner.py ...',
            'Testing input: 1.5 -> Output: 1.0 (Passed)',
            'Testing input: -0.2 -> Output: 0.0 (Passed)',
            'Testing input: 0.7 -> Output: 0.7 (Passed)',
            'All temperature mappings clamped correctly!'
          ];
        } else {
          simulatedLogs = [
            'python test_runner.py ...',
            'Testing input: 1.5 -> Output: None',
            'AssertionError: Expected 1.0, got None. Did you implement the clamping conditions?'
          ];
        }
      } else if (activeTutorial.id === 'prompting-2') {
        if (userText.includes('input:') && userText.includes('output:') && userText.includes('goodbye')) {
          simulatedLogs = [
            'Ingesting few-shot exemplar blocks...',
            'Parsing dynamic prompt variables...',
            'Input: "Have a nice day" -> SLANG OUTPUT -> "Keep on the sunny side, pal"',
            'Structural template matching: 100%'
          ];
        } else {
          simulatedLogs = [
            'Ingesting exemplar blocks...',
            'Syntax Error: Input/Output structural syntax template mismatch.',
            'Make sure you use "Input:" and "Output:" prefixes.'
          ];
        }
      } else if (activeTutorial.id === 'javascript-1') {
        if (userText.includes('createprompt') && (userText.includes('topic') || userText.includes('wordlimit'))) {
          simulatedLogs = [
            'node test_runner.js ...',
            'Testing: createPrompt("Quantum Physics", 150)',
            'Output: "Write an essay about Quantum Physics in less than 150 words. Format as clean Markdown."',
            'Tests passed: Dynamic interpolation verified.'
          ];
        } else {
          simulatedLogs = [
            'node test_runner.js ...',
            'ReferenceError: createPrompt is not defined or is failing to interpolate arguments correctly.'
          ];
        }
      }

      setConsoleOutput(simulatedLogs);
    }, 1200);
  };

  const handleSubmitAnswer = () => {
    // Regex based validation
    const regex = new RegExp(activeTutorial.expectedOutputRegex);
    const isValid = regex.test(codeValue);

    if (isValid) {
      setSuccessState('success');
      setFeedbackMsg(activeTutorial.feedbackSuccess);
      setSolvedInSession(true);

      // Award XP and flag completed lesson if not done before
      if (!progress.completedLessons.includes(activeTutorial.id)) {
        const updatedLessons = [...progress.completedLessons, activeTutorial.id];
        // Calculate new XP & level up threshold
        const newXp = progress.xp + 100;
        const newLevel = Math.floor(newXp / 300) + 1; // 300 XP per level
        
        onUpdateProgress({
          xp: newXp,
          level: newLevel,
          completedLessons: updatedLessons
        });
      }
    } else {
      setSuccessState('failure');
      setFeedbackMsg(activeTutorial.feedbackFailure);
    }
  };

  const handleResetWorkspace = () => {
    setCodeValue(activeTutorial.initialCode);
    setConsoleOutput(['Workspace reset. Input restored to default template.']);
    setSuccessState('idle');
    setFeedbackMsg('');
    setShowHint(null);
  };

  return (
    <div id="coding-sandbox-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
      
      {/* Title Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white flex items-center space-x-2">
            <BrainCircuit className="w-8 h-8 text-brand-secondary animate-float" />
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Interactive Learning Sandbox</span>
          </h1>
          <p className="text-sm text-white/60 font-sans mt-1">
            Write live code prompts, evaluate them, and gain experience in AI engineering.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-brand-primary/20 border border-brand-primary/30 rounded-2xl px-4 py-2.5 shadow-[0_0_20px_rgba(123,47,247,0.15)]">
          <Award className="w-5 h-5 text-brand-secondary animate-pulse" />
          <div className="text-xs">
            <span className="block font-bold text-white">Level {progress.level} Specialist</span>
            <span className="block font-semibold text-white/50 font-mono">{progress.xp} XP total • {progress.completedLessons.length}/{TUTORIALS.length} Lessons</span>
          </div>
        </div>
      </div>

      {/* Mobile view switch tabs (visible only on mobile) */}
      <div className="flex lg:hidden bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 mb-6 text-xs font-mono font-bold">
        <button 
          onClick={() => setMobileActiveTab('instructions')}
          className={`flex-1 py-2.5 rounded-xl font-bold transition-all uppercase flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileActiveTab === 'instructions' ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-md font-bold' : 'text-white/60 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Guide</span>
        </button>
        <button 
          onClick={() => setMobileActiveTab('editor')}
          className={`flex-1 py-2.5 rounded-xl font-bold transition-all uppercase flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileActiveTab === 'editor' ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-md font-bold' : 'text-white/60 hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Tutorial List & Instructions */}
        <div className={`${mobileActiveTab === 'instructions' ? 'flex' : 'hidden lg:flex'} lg:col-span-4 flex-col space-y-6`}>
          
          {/* Tutorial Lesson Selection */}
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-5 shadow-2xl">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white/40 mb-4">
              AI Learning Lessons
            </h3>
            <div className="space-y-2">
              {TUTORIALS.map((tut) => {
                const isCompleted = progress.completedLessons.includes(tut.id);
                const isActive = activeTutorialId === tut.id;
                return (
                  <button
                    key={tut.id}
                    onClick={() => setActiveTutorialId(tut.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white shadow-xl shadow-brand-primary/20 border border-white/10' 
                        : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Code className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-secondary'}`} />
                      <div>
                        <span className="block font-semibold text-xs font-sans">
                          {tut.title}
                        </span>
                        <span className={`block text-[10px] uppercase tracking-wider font-mono font-medium ${isActive ? 'text-white/80' : 'text-white/40'}`}>
                          {tut.category} • {tut.difficulty}
                        </span>
                      </div>
                    </div>
                    {isCompleted ? (
                      <CheckCircle className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                    ) : (
                      <ChevronRight className={`w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instructions Box */}
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-5 shadow-2xl flex-grow">
            <div className="flex items-center space-x-2 pb-3 border-b border-white/10 mb-4">
              <Sparkles className="w-5 h-5 text-brand-secondary animate-pulse" />
              <h3 className="font-display font-bold text-sm text-white">
                Active Instructions
              </h3>
            </div>
            
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider font-mono">
              The Objective
            </p>
            <p className="text-sm font-sans text-white/80 mt-1 leading-relaxed">
              {activeTutorial.description}
            </p>

            <div className="p-4 bg-brand-primary/10 rounded-xl border border-brand-primary/20 mt-4">
              <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider font-mono">
                Task Requirements:
              </p>
              <p className="text-xs font-medium text-white/90 mt-1 leading-relaxed font-sans">
                {activeTutorial.instructions}
              </p>
            </div>

            {/* Hints Accordion */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider font-mono mb-2">
                Need Assistance?
              </p>
              <div className="space-y-1">
                {activeTutorial.hints.map((hint, idx) => (
                  <div key={idx} className="border border-white/5 rounded-lg overflow-hidden bg-white/5">
                    <button
                      onClick={() => setShowHint(showHint === idx ? null : idx)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-white/80 flex items-center justify-between hover:bg-white/10 cursor-pointer"
                    >
                      <span className="flex items-center space-x-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Reveal Hint #{idx + 1}</span>
                      </span>
                      <span>{showHint === idx ? '-' : '+'}</span>
                    </button>
                    {showHint === idx && (
                      <div className="p-3 bg-[#050816]/50 text-xs font-sans text-white/60 leading-relaxed border-t border-white/5">
                        {hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Code Editor Area & Simulated Console */}
        <div className={`${mobileActiveTab === 'editor' ? 'flex' : 'hidden lg:flex'} lg:col-span-8 flex-col space-y-6`}>
          
          {/* Editor Box */}
          <div className="bg-[#0b1120] rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-2xl min-h-[400px]">
            {/* Editor Header Bar */}
            <div className="bg-slate-950/80 border-b border-white/10 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-brand-secondary" />
                <span className="text-xs font-mono font-semibold text-white/85">
                  {activeTutorial.category === 'Python' ? 'workspace.py' : activeTutorial.category === 'JavaScript' ? 'workspace.ts' : 'system_instruction.md'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetWorkspace}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono text-white/70 hover:text-white transition-all flex items-center space-x-1 cursor-pointer"
                  title="Reset code editor"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Line-numbered Text Area */}
            <div className="flex-grow flex relative font-mono text-sm leading-relaxed p-4 bg-slate-900/50">
              {/* Fake Line Numbers */}
              <div className="w-8 select-none text-right text-white/20 pr-3 border-r border-white/10 mr-3 font-mono text-xs">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              {/* Actual Text Area */}
              <textarea
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                className="flex-grow bg-transparent text-white/90 outline-none resize-none font-mono text-xs focus:ring-0 placeholder-white/20 min-h-[300px]"
                spellCheck="false"
                placeholder="# Write code or prompt sequence here..."
              />
            </div>

            {/* Control Button Bar */}
            <div className="bg-slate-950/80 border-t border-white/10 px-6 py-4 flex items-center justify-between">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-5 py-2.5 rounded-xl font-display font-semibold text-xs bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white flex items-center space-x-1.5 transition-all cursor-pointer border border-white/10"
              >
                {isRunning ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current text-brand-secondary" />
                )}
                <span>Run Code</span>
              </button>

              <button
                onClick={handleSubmitAnswer}
                className="px-6 py-2.5 rounded-xl font-display font-bold text-xs shining-btn hover:scale-[1.02] active:scale-[0.98] text-white flex items-center space-x-1.5 transition-all cursor-pointer border border-white/10"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Submit Answer</span>
              </button>
            </div>
          </div>

          {/* Validation Feedback & Console Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Console output */}
            <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col h-[200px]">
              <div className="flex items-center space-x-2 text-white/50 text-[10px] font-mono uppercase tracking-wider pb-2 border-b border-white/5 mb-3">
                <Terminal className="w-3.5 h-3.5 text-brand-secondary" />
                <span>Terminal Output</span>
              </div>
              <div className="flex-grow overflow-y-auto font-mono text-[11px] text-emerald-400/90 space-y-1">
                {consoleOutput.map((log, idx) => (
                  <p key={idx} className={log.includes('Error') || log.includes('Assertion') ? 'text-rose-400' : log.startsWith('>') ? 'text-white/60' : ''}>
                    {log}
                  </p>
                ))}
              </div>
            </div>

            {/* Right validation state box */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col justify-center min-h-[200px]">
              <AnimatePresence mode="wait">
                {successState === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center p-4 space-y-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-brand-secondary">
                      <Code className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-sm text-white">Awaiting Submission</h4>
                    <p className="text-xs text-white/60 font-sans leading-relaxed">
                      Write your solution in the editor workspace above, test it with "Run Code", and submit for verification.
                    </p>
                  </motion.div>
                )}

                {successState === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center p-4 space-y-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <h4 className="font-display font-black text-sm text-emerald-400 flex items-center justify-center space-x-1">
                      <span>Verification Succeeded!</span>
                    </h4>
                    <p className="text-xs text-white/80 font-sans leading-relaxed">
                      {feedbackMsg}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full font-mono">
                        +100 XP Awarded
                      </span>
                    </div>
                  </motion.div>
                )}

                {successState === 'failure' && (
                  <motion.div
                    key="failure"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center p-4 space-y-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-sm text-rose-400">Validation Failed</h4>
                    <p className="text-xs text-white/70 font-sans leading-relaxed">
                      {feedbackMsg}
                    </p>
                    <p className="text-[10px] font-mono text-white/50">
                      Hint: Review requirements or inspect the hints.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
