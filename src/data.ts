import { Course, Tutorial, Resource, ForumPost, Achievement, AIAgent, AgentIntegration, AgentWorkflowRule, MultiAgentTeam } from './types';

export const COURSES: Course[] = [
  {
    id: 'ai-prompt-engineering',
    title: 'Prompt Engineering Masterclass',
    category: 'Prompting',
    rating: 4.9,
    difficulty: 'Beginner',
    duration: '6 hours',
    students: 4820,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    description: 'Learn the core principles of eliciting high-quality responses from Large Language Models. Master zero-shot, few-shot, Chain-of-Thought, and system instructions.',
    curriculum: [
      'Foundations of Language Models',
      'The Anatomy of a Perfect Prompt',
      'Few-Shot Prompting and Exemplars',
      'Chain-of-Thought & Reasoning Explanations',
      'System Prompts & Model Persona Tuning',
      'Mitigating Hallucinations & Output Formatting'
    ]
  },
  {
    id: 'python-for-ai',
    title: 'Python for AI & Machine Learning',
    category: 'Python',
    rating: 4.8,
    difficulty: 'Intermediate',
    duration: '14 hours',
    students: 3120,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    description: 'Master Numpy, Pandas, and basic scikit-learn. Build a solid mathematical and practical understanding of model data processing pipelines.',
    curriculum: [
      'Python Essentials Recap',
      'Data Manipulation with Pandas & Numpy',
      'Data Visualization for Scientists',
      'Supervised Learning Basics with Scikit-Learn',
      'Feature Engineering & Normalization',
      'Evaluating Model Metrics (MSE, F1, Precision)'
    ]
  },
  {
    id: 'nextjs-ai-saas',
    title: 'Build AI SaaS Applications',
    category: 'JavaScript',
    rating: 4.95,
    difficulty: 'Advanced',
    duration: '18 hours',
    students: 1980,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    description: 'Connect Next.js 15, React 19, and Tailwind CSS to the Gemini API. Build full-stack apps with streaming, persistent conversations, and edge functions.',
    curriculum: [
      'Next.js 15 App Router Architecture',
      'Streaming API Responses in React 19',
      'State Management for Interactive Chatbots',
      'Securing API Keys via Server Actions',
      'Optimizing Token Consumption',
      'Full Project: The AI Essay Editor with real-time feedback'
    ]
  },
  {
    id: 'ui-ux-luxury-design',
    title: 'Premium UX Design & Luxury Branding',
    category: 'Design',
    rating: 4.9,
    difficulty: 'Beginner',
    duration: '8 hours',
    students: 2430,
    image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=800&q=80',
    description: 'Learn to design modern, elegant, and high-converting dark-theme SaaS interfaces inspired by Apple, Stripe, and Linear. Master spatial geometry.',
    curriculum: [
      'The Psychology of Premium Interfaces',
      'Geometric Grids and Dynamic Negative Space',
      'Luxury Typography & Font Hierarchy',
      'Advanced CSS/Tailwind Blurs and Glassmorphism',
      'Micro-interactions and Delight Triggers',
      'Portfolio Showcase & Client Presentations'
    ]
  },
  {
    id: 'freelance-scaling',
    title: 'AI Freelancer: Scale to $10K/mo',
    category: 'Business',
    rating: 4.7,
    difficulty: 'Intermediate',
    duration: '10 hours',
    students: 1540,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    description: 'Stop trading time for money. Leverage generative AI agents to write, code, and design 10x faster. Learn high-value client acquisition.',
    curriculum: [
      'Positioning Yourself as an AI Specialist',
      'Setting Up Your Automated AI Workflow Hub',
      'High-Ticket Client Acquisition Framework',
      'Value-Based Pricing vs Hour Billing',
      'Automating Delivery & AI Code Integration',
      'Framer and No-Code Multiplier Secrets'
    ]
  }
];

export const TUTORIALS: Tutorial[] = [
  {
    id: 'prompting-1',
    title: 'System Prompts & Personas',
    category: 'Prompting',
    difficulty: 'Beginner',
    description: 'Configure a system prompt that enforces strict JSON output. By injecting constraints early, you ensure predictable structured integration in your downstream pipelines.',
    instructions: 'Edit the system prompt on line 1 so that the assistant acts as a strict "JSON Classifier" and outputs only a JSON object like {"sentiment": "positive" | "negative", "score": float}. Make sure the prompt includes the exact word "JSON".',
    initialCode: 'SYSTEM_PROMPT = "You are a helpful assistant. Help me classify text sentiment."\n\n# Your task:\n# Write a strict system prompt instructing the model to act as a JSON Classifier.\n# It must only output JSON format without conversational filler.',
    solutionTemplate: 'SYSTEM_PROMPT = "You are a JSON Classifier. Analyze the input sentiment and return a valid JSON object strictly containing keys \'sentiment\' and \'score\'. Output only JSON with no other text."',
    expectedOutputRegex: '(?i)(json|classifier|sentiment|score)',
    feedbackSuccess: 'Masterful! You restricted the LLM to valid JSON. System prompting is the first and most critical line of defense for reliable application flows.',
    feedbackFailure: 'Try again! Make sure your system prompt is clear, explicitly asks for "JSON" formatting, and restricts any other conversational output.',
    hints: [
      'Incorporate the word "JSON" explicitly.',
      'Instruct the model to emit zero conversational prelude or postscript.'
    ]
  },
  {
    id: 'python-1',
    title: 'Python AI: Temperature Mapping',
    category: 'Python',
    difficulty: 'Beginner',
    description: 'In generative AI, temperature controls output randomness (0.0 for deterministic, 1.0 for creative). Let\'s write a helper function to validate temperature ranges.',
    instructions: 'Complete the python function `clamp_temperature(t)` so that if a user provides a value less than 0.0, it returns 0.0. If greater than 1.0, it returns 1.0. Otherwise, return the value.',
    initialCode: 'def clamp_temperature(t: float) -> float:\n    # TODO: Clamp the temperature between 0.0 and 1.0\n    pass\n\n# Test with 1.5 and -0.2\nprint(clamp_temperature(1.5))\nprint(clamp_temperature(-0.2))',
    solutionTemplate: 'def clamp_temperature(t: float) -> float:\n    if t < 0.0:\n        return 0.0\n    elif t > 1.0:\n        return 1.0\n    return t\n\nprint(clamp_temperature(1.5))\nprint(clamp_temperature(-0.2))',
    expectedOutputRegex: '1\\.0[\\s\\n]+0\\.0',
    feedbackSuccess: 'Flawless logic! Clamping hyperparameters ensures your AI endpoints never crash from invalid configuration requests.',
    feedbackFailure: 'Check your condition statements! If temperature is above 1.0, return 1.0. If below 0.0, return 0.0.',
    hints: [
      'Use an standard if-elif-else construct.',
      'Alternatively, you can use min(max(t, 0.0), 1.0).'
    ]
  },
  {
    id: 'prompting-2',
    title: 'Few-Shot Example Structuring',
    category: 'Prompting',
    difficulty: 'Intermediate',
    description: 'Few-shot prompting shows the model concrete input/output pairings, guiding it to follow precise syntactic styles without fine-tuning weights.',
    instructions: 'Draft a few-shot prompt that teaches the model to translate formal English to 1920s jazz slang. Provide at least one complete example (Input: "Goodbye", Output: "See ya, cat").',
    initialCode: 'FEW_SHOT_PROMPT = """\nTranslate formal English to 1920s Jazz slang.\n\nInput: [Example input here]\nOutput: [Example output here]\n\nInput: "Have a nice day"\nOutput:\n"""',
    solutionTemplate: 'FEW_SHOT_PROMPT = """\nTranslate formal English to 1920s Jazz slang.\n\nInput: "Goodbye"\nOutput: "See ya, cat"\n\nInput: "Have a nice day"\nOutput: "Keep on the sunny side, pal"\n"""',
    expectedOutputRegex: '(?i)(input|output|goodbye|cat|jazz|slang)',
    feedbackSuccess: 'Amazing! Few-shot prompting teaches the model tone, vocabulary, and shape instantly. It is ideal for creative copy generation!',
    feedbackFailure: 'Be sure to keep the label format intact: "Input: [text]" and "Output: [text]" and include the goodbye example.',
    hints: [
      'Follow the template pattern strictly.',
      'Include the word "Goodbye" and "cat" in your exemplar block.'
    ]
  },
  {
    id: 'javascript-1',
    title: 'Dynamic System Template Injector',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    description: 'Build a dynamic prompt templater in TypeScript/JavaScript that safely formats variables into prompt structures.',
    instructions: 'Write a JavaScript template literal function `createPrompt(topic, wordLimit)` that returns: "Write an essay about [topic] in less than [wordLimit] words. Format as clean Markdown."',
    initialCode: 'function createPrompt(topic, wordLimit) {\n  // TODO: Use template literals to construct the instruction\n  return "";\n}\n\nconsole.log(createPrompt("Quantum Physics", 150));',
    solutionTemplate: 'function createPrompt(topic, wordLimit) {\n  return `Write an essay about ${topic} in less than ${wordLimit} words. Format as clean Markdown.`;\n}\n\nconsole.log(createPrompt("Quantum Physics", 150));',
    expectedOutputRegex: 'Write an essay about Quantum Physics in less than 150 words\\. Format as clean Markdown\\.',
    feedbackSuccess: 'Superb! Prompt templating is the bread and butter of developer-facing generative workflows. You can dynamically steer the models now!',
    feedbackFailure: 'Check the exact phrasing! It must match "Write an essay about [topic] in less than [wordLimit] words. Format as clean Markdown." exactly (check dots and capitalization).',
    hints: [
      'Ensure you are using standard backticks ` for the template string.',
      'Reference the arguments as ${topic} and ${wordLimit} respectively.'
    ]
  }
];

export const RESOURCES: Resource[] = [
  {
    id: 'cheatsheet-llm',
    title: 'The Ultimate Prompting Cheat Sheet',
    type: 'Cheat Sheet',
    category: 'AI & Prompting',
    description: 'A concise cheat sheet featuring perfect structural layouts for system instructions, variable insertions, and context boundaries.',
    readingTime: '5 min read'
  },
  {
    id: 'guide-agents',
    title: 'Autonomous AI Agents: Architectures & Design',
    type: 'Guide',
    category: 'Agentic AI',
    description: 'Deep dive into loop structures, tool calling patterns, state persistence databases, and verification guardrails for full agentic operations.',
    readingTime: '22 min read'
  },
  {
    id: 'video-saas',
    title: 'Building Full Stack AI Apps with Gemini API',
    type: 'Video',
    category: 'Full-Stack Coding',
    description: 'Learn how to secure API keys, manage chunk-by-chunk streaming responses, and create highly interactive text editors.',
    readingTime: '45 min watch'
  },
  {
    id: 'template-portfolio',
    title: 'Developer AI Portfolio Boilerplate',
    type: 'Template',
    category: 'Career Growth',
    description: 'A pre-designed Next.js + Tailwind React template crafted with elegant dark canvas layout, micro-interactions, and visual proof of skills.',
    readingTime: '10 min setup'
  },
  {
    id: 'cheatsheet-python',
    title: 'Numpy & Pandas AI Pre-processing Reference',
    type: 'Cheat Sheet',
    category: 'Data Science',
    description: 'The exact commands you need to know for cleaning datasets, handling missing values, and feeding matrices safely to scikit estimators.',
    readingTime: '8 min read'
  }
];

export const FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    title: '🔥 Best setup for Gemini 1.5 Pro agent loops?',
    content: 'Hey devs! I am currently building a coding companion using the Gemini API. Has anyone optimized the feedback loop? Right now, I am using a few-shot prompt with error correction, but occasionally it falls into infinite loops where it repeats the same fix. What are your tips for state tracking and loop breaks?',
    category: 'Prompt Engineering',
    likes: 34,
    hasLiked: false,
    createdAt: '2 hours ago',
    isPinned: true,
    replies: [
      {
        id: 'reply-1',
        author: 'Marcus Aurelius (Mentor)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        content: 'Hi Elena! The key is establishing a max_iterations threshold (usually 3 to 5) and maintaining a historical stack of previous hashes of code changes. If a code hash matches an earlier state, explicitly inject a system message saying "You have already attempted this code. It failed with X. Do not repeat this strategy. Try a completely different approach."',
        createdAt: '1 hour ago',
        likes: 12,
        isMentor: true
      },
      {
        id: 'reply-2',
        author: 'Kenji Suzuki',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
        content: 'Maintaining hash state worked wonders in our project. Also, lowering temperature to 0.1 for the corrective step helps a ton with keeping it logical rather than creative!',
        createdAt: '45 mins ago',
        likes: 5
      }
    ]
  },
  {
    id: 'post-2',
    author: 'Devon Carter',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
    title: 'Showcase: My AI-powered Markdown Editor build with Kronex principles!',
    content: 'Just finished my course capstone on Kronex AI. Built a minimalist luxury Markdown editor that analyzes tone in real-time, matching my visual system to Apple-inspired slate palettes. Standard localStorage persistence keeps it fast and serverless! Thanks to mentor Marcus Aurelius for the grid guides.',
    category: 'Showcase',
    likes: 42,
    hasLiked: false,
    createdAt: '4 hours ago',
    replies: [
      {
        id: 'reply-3',
        author: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
        content: 'This looks incredibly clean! Do you have a live link? The typography spacing looks gorgeous.',
        createdAt: '3 hours ago',
        likes: 2
      }
    ]
  },
  {
    id: 'post-3',
    author: 'Aria Thompson',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
    title: 'How necessary is linear algebra for practical AI application building?',
    content: 'Starting the Python AI path. I do not have a strong math background. Can I build production-ready integrations using Gemini and scikit-learn without understanding linear algebra inside out? Or should I pause and do a linear algebra course first?',
    category: 'Python',
    likes: 18,
    hasLiked: false,
    createdAt: '1 day ago',
    replies: [
      {
        id: 'reply-4',
        author: 'Marcus Aurelius (Mentor)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        content: 'Absolutely not necessary to pause! For 95% of software applications, you need intuitive understanding of dimensions (arrays/tensors) and matrices, which we teach practically in our Numpy chapters. Focus on data modeling and orchestrating API agents first, then dive into deep math later if you decide to train custom neural weights from scratch.',
        createdAt: '20 hours ago',
        likes: 15,
        isMentor: true
      }
    ]
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-step',
    title: 'First Contact',
    description: 'Complete your first interactive coding sandbox tutorial.',
    icon: 'Sparkles',
    progress: 0,
    target: 1,
    current: 0
  },
  {
    id: 'ach-prompt-wizard',
    title: 'Prompt Alchemist',
    description: 'Successfully pass all prompt engineering tutorials.',
    icon: 'BrainCircuit',
    progress: 0,
    target: 2,
    current: 0
  },
  {
    id: 'ach-streak-builder',
    title: 'Streak Novitiate',
    description: 'Gain a daily continuous coding streak of 3 days.',
    icon: 'Zap',
    progress: 33,
    target: 3,
    current: 1
  },
  {
    id: 'ach-forum-post',
    title: 'Voice of the Nebula',
    description: 'Participate in a community thread or publish a new post.',
    icon: 'MessageSquareCode',
    progress: 0,
    target: 1,
    current: 0
  }
];

export const DEFAULT_AGENTS: AIAgent[] = [
  {
    id: 'agent-sovereign-core',
    name: 'KRONEX Sovereign Core',
    avatar: '🤖',
    coverBanner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    description: 'Autonomous multi-step reasoning agent with live web search, system architecture design, and direct code execution.',
    category: 'General',
    systemPrompt: 'You are KRONEX Sovereign Core, an elite AI agent specializing in high-level software architecture, deep reasoning, and autonomous multi-tool execution.',
    personality: 'Sovereign',
    model: 'Gemini',
    temperature: 0.3,
    memoryEnabled: true,
    capabilities: {
      memory: true,
      webSearch: true,
      vision: true,
      voice: true,
      fileAnalysis: true,
      imageGen: true,
      codeExecution: true,
      automation: true,
      apiCalls: true
    },
    voiceSettings: {
      wakeWord: 'Hey Kronex',
      voiceName: 'Neural Cyber Voice',
      pushToTalk: false,
      speechRate: 1.0,
      speechPitch: 1.0
    },
    knowledgeFiles: [
      { id: 'f-1', name: 'Kronex_Architecture_v2.pdf', size: '2.4 MB', type: 'pdf', uploadedAt: '2026-07-20', chunksCount: 48 },
      { id: 'f-2', name: 'API_Endpoints_Spec.json', size: '150 KB', type: 'json', uploadedAt: '2026-07-21', chunksCount: 12 }
    ],
    tools: ['web_search', 'calculator', 'image_gen', 'code_interpreter', 'browser'],
    status: 'active',
    createdAt: '2026-07-01',
    memoryItems: [
      { id: 'm-1', key: 'preferred_language', value: 'TypeScript & Python', category: 'Preferences', updatedAt: '2026-07-21' },
      { id: 'm-2', key: 'database_provider', value: 'Firebase Firestore & Cloud SQL', category: 'Architecture', updatedAt: '2026-07-21' }
    ],
    tasks: [
      { id: 't-1', title: 'Hourly System Diagnostics', status: 'completed', schedule: '0 * * * *', lastRun: '10 mins ago' },
      { id: 't-2', title: 'GitHub Security Vulnerability Audit', status: 'scheduled', schedule: '0 0 * * *', lastRun: '1 day ago' }
    ],
    automations: [
      { id: 'a-1', name: 'n8n Webhook Auto-Deploy', trigger: 'GitHub PR Merge', target: 'Cloud Run Container', status: 'active' },
      { id: 'a-2', name: 'Slack Incident Alert', trigger: 'HTTP 500 Error', target: 'Slack Channel #dev-ops', status: 'active' }
    ]
  },
  {
    id: 'agent-jarvis-dev',
    name: 'Jarvis Full-Stack Engineer',
    avatar: '⚡',
    coverBanner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    description: 'Senior Full-Stack Developer agent powered by Claude 3.5 Sonnet. Expert in React 19, Node.js, TypeScript, and Docker containerization.',
    category: 'Coding',
    systemPrompt: 'You are Jarvis, a top 1% Full-Stack Software Engineer. Write pristine, modular, fully typed code with thorough error handling and modern styling.',
    personality: 'Developer',
    model: 'Claude',
    temperature: 0.2,
    memoryEnabled: true,
    capabilities: {
      memory: true,
      webSearch: true,
      vision: true,
      voice: false,
      fileAnalysis: true,
      imageGen: false,
      codeExecution: true,
      automation: true,
      apiCalls: true
    },
    voiceSettings: {
      wakeWord: 'Hey Jarvis',
      voiceName: 'Tech Innovator Male',
      pushToTalk: true,
      speechRate: 1.1,
      speechPitch: 0.95
    },
    knowledgeFiles: [
      { id: 'f-3', name: 'React19_Design_Patterns.md', size: '420 KB', type: 'markdown', uploadedAt: '2026-07-18', chunksCount: 16 }
    ],
    tools: ['code_interpreter', 'web_search', 'calculator', 'n8n_webhook'],
    status: 'active',
    createdAt: '2026-07-05',
    memoryItems: [
      { id: 'm-3', key: 'ui_library', value: 'Tailwind CSS + Lucide Icons + Motion', category: 'Frontend', updatedAt: '2026-07-20' }
    ],
    tasks: [
      { id: 't-3', title: 'Automated Unit Test Generator', status: 'completed', lastRun: '2 hours ago' }
    ],
    automations: [
      { id: 'a-3', name: 'Docker Auto-Build', trigger: 'Code Commit', target: 'Docker Registry', status: 'active' }
    ]
  },
  {
    id: 'agent-quantum-analyst',
    name: 'DeepSeek Quantum Analyst',
    avatar: '🧠',
    coverBanner: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    description: 'Deep reasoning data scientist capable of handling complex mathematical proofs, SQL query optimization, and predictive financial modeling.',
    category: 'Data',
    systemPrompt: 'You are DeepSeek Quantum Analyst. Break down complex queries into structured step-by-step mathematical reasoning steps before answering.',
    personality: 'Professional',
    model: 'DeepSeek',
    temperature: 0.1,
    memoryEnabled: true,
    capabilities: {
      memory: true,
      webSearch: true,
      vision: false,
      voice: false,
      fileAnalysis: true,
      imageGen: false,
      codeExecution: true,
      automation: true,
      apiCalls: true
    },
    voiceSettings: {
      wakeWord: 'Hey Quantum',
      voiceName: 'Analytical Precision',
      pushToTalk: true,
      speechRate: 1.0,
      speechPitch: 1.0
    },
    knowledgeFiles: [
      { id: 'f-4', name: 'Financial_Q2_Data.csv', size: '1.8 MB', type: 'csv', uploadedAt: '2026-07-15', chunksCount: 32 }
    ],
    tools: ['calculator', 'sql_database', 'code_interpreter', 'web_search'],
    status: 'idle',
    createdAt: '2026-07-10',
    memoryItems: [
      { id: 'm-4', key: 'target_metric', value: 'Sharpe Ratio > 2.5', category: 'Finance', updatedAt: '2026-07-19' }
    ],
    tasks: [],
    automations: []
  },
  {
    id: 'agent-socrates-tutor',
    name: 'Socrates AI Mentor',
    avatar: '🎓',
    coverBanner: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    description: 'Socratic educator agent designed to guide students through AI algorithms, prompt engineering, and machine learning concepts.',
    category: 'Voice Tutor',
    systemPrompt: 'You are Socrates, a patient and encouraging AI Professor. Guide users by asking thoughtful questions and providing clear analogies.',
    personality: 'Teacher',
    model: 'OpenAI',
    temperature: 0.5,
    memoryEnabled: true,
    capabilities: {
      memory: true,
      webSearch: true,
      vision: true,
      voice: true,
      fileAnalysis: true,
      imageGen: false,
      codeExecution: true,
      automation: false,
      apiCalls: false
    },
    voiceSettings: {
      wakeWord: 'Hey Professor',
      voiceName: 'Socratic Warmth Female',
      pushToTalk: false,
      speechRate: 0.95,
      speechPitch: 1.05
    },
    knowledgeFiles: [],
    tools: ['web_search', 'calculator'],
    status: 'active',
    createdAt: '2026-07-12',
    memoryItems: [],
    tasks: [],
    automations: []
  },
  {
    id: 'agent-voice-concierge',
    name: 'KRONEX Voice Concierge',
    avatar: '🎙️',
    coverBanner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    description: 'Real-time conversational voice concierge with natural speech synthesis, low-latency barge-in support, and multi-lingual voice translation.',
    category: 'Voice Tutor',
    systemPrompt: 'You are KRONEX Voice Concierge. Speak succinctly and naturally in short conversational sentences ideal for voice output.',
    personality: 'Friendly',
    model: 'Grok',
    temperature: 0.6,
    memoryEnabled: true,
    capabilities: {
      memory: true,
      webSearch: true,
      vision: true,
      voice: true,
      fileAnalysis: false,
      imageGen: true,
      codeExecution: false,
      automation: true,
      apiCalls: true
    },
    voiceSettings: {
      wakeWord: 'Hey Kronex Voice',
      voiceName: 'Crystal Studio Direct',
      pushToTalk: false,
      speechRate: 1.05,
      speechPitch: 1.1
    },
    knowledgeFiles: [],
    tools: ['web_search', 'browser'],
    status: 'active',
    createdAt: '2026-07-14',
    memoryItems: [],
    tasks: [],
    automations: []
  }
];

export const DEFAULT_INTEGRATIONS: AgentIntegration[] = [
  {
    id: 'int-gemini',
    name: 'Google AI Studio',
    provider: 'Google Cloud',
    category: 'LLM & Vision',
    iconName: 'Sparkles',
    description: 'Gemini 2.5 Flash & Gemini 1.5 Pro with native 2M context and search grounding.',
    connected: true,
    apiKey: 'AIzaSy...KRONEX_LIVE_KEY',
    status: 'connected',
    latencyMs: 140,
    totalCalls: 12480,
    tokensUsed: 4250000,
    lastTested: 'Just now'
  },
  {
    id: 'int-openai',
    name: 'OpenAI Platform',
    provider: 'OpenAI',
    category: 'LLM & Embeddings',
    iconName: 'Bot',
    description: 'GPT-4o, o3-mini, DALL-E 3, and text-embedding-3-large vector engines.',
    connected: true,
    apiKey: 'sk-proj-...88219x',
    status: 'connected',
    latencyMs: 210,
    totalCalls: 8920,
    tokensUsed: 3100000,
    lastTested: '5 mins ago'
  },
  {
    id: 'int-claude',
    name: 'Anthropic Claude',
    provider: 'Anthropic',
    category: 'LLM & Code',
    iconName: 'Brain',
    description: 'Claude 3.5 Sonnet & Claude 3 Opus for deep coding and complex analytical reasoning.',
    connected: true,
    apiKey: 'sk-ant-api03-...9921a',
    status: 'connected',
    latencyMs: 185,
    totalCalls: 6540,
    tokensUsed: 2800000,
    lastTested: '12 mins ago'
  },
  {
    id: 'int-grok',
    name: 'xAI Grok',
    provider: 'xAI',
    category: 'Realtime Web',
    iconName: 'Zap',
    description: 'Grok 3 and Grok-2 vision engines with live X social search capability.',
    connected: true,
    apiKey: 'xai-...921008x',
    status: 'connected',
    latencyMs: 160,
    totalCalls: 3410,
    tokensUsed: 1200000,
    lastTested: '1 hour ago'
  },
  {
    id: 'int-deepseek',
    name: 'DeepSeek AI',
    provider: 'DeepSeek',
    category: 'Reasoning Engine',
    iconName: 'Cpu',
    description: 'DeepSeek R1 and V3 open weights models with chain-of-thought verification.',
    connected: true,
    apiKey: 'sk-ds-...01923a',
    status: 'connected',
    latencyMs: 195,
    totalCalls: 5120,
    tokensUsed: 1900000,
    lastTested: '20 mins ago'
  },
  {
    id: 'int-mistral',
    name: 'Mistral AI',
    provider: 'Mistral',
    category: 'Efficient LLM',
    iconName: 'Layers',
    description: 'Mistral Large and Codestral tailored for low-latency specialized tasks.',
    connected: false,
    apiKey: '',
    status: 'disconnected',
    latencyMs: 0,
    totalCalls: 0,
    tokensUsed: 0
  },
  {
    id: 'int-perplexity',
    name: 'Perplexity AI',
    provider: 'Perplexity',
    category: 'Search Engine',
    iconName: 'Globe',
    description: 'Sonar Pro and Sonar Reasoning search grounding APIs with live citation backings.',
    connected: true,
    apiKey: 'pplx-...30192',
    status: 'standby',
    latencyMs: 230,
    totalCalls: 1840,
    tokensUsed: 620000,
    lastTested: '3 hours ago'
  },
  {
    id: 'int-huggingface',
    name: 'Hugging Face Hub',
    provider: 'Hugging Face',
    category: 'Model Registry',
    iconName: 'Terminal',
    description: 'Inference Endpoints and 500,000+ open source models and datasets.',
    connected: true,
    apiKey: 'hf_...99201',
    status: 'connected',
    latencyMs: 290,
    totalCalls: 950,
    tokensUsed: 410000,
    lastTested: 'Yesterday'
  },
  {
    id: 'int-stability',
    name: 'Stability AI',
    provider: 'Stability',
    category: 'Image & Video',
    iconName: 'ImageIcon',
    description: 'Stable Diffusion 3.5, SDXL Turbo, and Stable Video 3D generation.',
    connected: true,
    apiKey: 'sk-stb-...10293',
    status: 'connected',
    latencyMs: 820,
    totalCalls: 1420,
    tokensUsed: 0,
    lastTested: '4 hours ago'
  },
  {
    id: 'int-replicate',
    name: 'Replicate Cloud',
    provider: 'Replicate',
    category: 'Serverless GPU',
    iconName: 'Server',
    description: 'Run FLUX.1, Llama 3, and open vision models on demand.',
    connected: false,
    apiKey: '',
    status: 'disconnected',
    latencyMs: 0,
    totalCalls: 0,
    tokensUsed: 0
  },
  {
    id: 'int-n8n',
    name: 'n8n Automation',
    provider: 'n8n.io',
    category: 'Workflow Automation',
    iconName: 'Zap',
    description: 'Connect 400+ SaaS apps, webhooks, and multi-step triggers seamlessly.',
    connected: true,
    apiKey: 'n8n_api_...99102',
    status: 'connected',
    latencyMs: 95,
    totalCalls: 8400,
    tokensUsed: 0,
    lastTested: '10 mins ago'
  },
  {
    id: 'int-github',
    name: 'GitHub API & Actions',
    provider: 'GitHub',
    category: 'Code Repository',
    iconName: 'Code',
    description: 'Auto pull requests, repo analysis, commit triggers, and Actions workflows.',
    connected: true,
    apiKey: 'ghp_...10293848',
    status: 'connected',
    latencyMs: 110,
    totalCalls: 3200,
    tokensUsed: 0,
    lastTested: '15 mins ago'
  },
  {
    id: 'int-firebase',
    name: 'Firebase Firestore & Auth',
    provider: 'Google Cloud',
    category: 'Database & Security',
    iconName: 'Database',
    description: 'Real-time document database, vector embeddings storage, and user identity.',
    connected: true,
    apiKey: 'AIzaSy...FIREBASE_PROJECT',
    status: 'connected',
    latencyMs: 45,
    totalCalls: 28900,
    tokensUsed: 0,
    lastTested: 'Just now'
  }
];

export const DEFAULT_WORKFLOWS: AgentWorkflowRule[] = [
  {
    id: 'wf-1',
    name: 'Autonomous Code Review & PR Linting',
    trigger: 'GitHub PR Created Event',
    condition: 'PR changes > 5 files or security critical label',
    action: 'Run Jarvis Agent -> Comment Lint Results & Request Changes',
    schedule: 'Event-Driven (Realtime Webhook)',
    status: 'active',
    logs: [
      { timestamp: '10:14 AM', status: 'success', message: 'Triggered PR #42. Jarvis analyzed 8 files. 0 vulnerabilities found.' },
      { timestamp: '09:02 AM', status: 'success', message: 'Triggered PR #41. Auto-formatted code according to KRONEX guidelines.' }
    ]
  },
  {
    id: 'wf-2',
    name: 'Daily AI Market Research Digest',
    trigger: 'Cron Schedule (Everyday 08:00 UTC)',
    condition: 'Search groundings return > 3 breaking news items',
    action: 'Run Sovereign Core -> Generate PDF Brief & Send Email',
    schedule: '0 8 * * * (Daily)',
    status: 'active',
    logs: [
      { timestamp: 'Today 08:00 AM', status: 'success', message: 'Generated Market Brief PDF (3.2 MB). Broadcasted to #announcements.' }
    ]
  },
  {
    id: 'wf-3',
    name: 'High CPU Incident Auto-Healing',
    trigger: 'Cloud Run CPU Utilization > 85%',
    condition: 'Duration > 3 minutes',
    action: 'Run DeepSeek Quantum Analyst -> Trigger Auto-Scale + Clear Cache',
    schedule: 'Event-Driven',
    status: 'active',
    logs: [
      { timestamp: 'Yesterday 14:22', status: 'success', message: 'Detected spike at 88% CPU. Auto-scaled container instances to 4 nodes.' }
    ]
  }
];

export const DEFAULT_TEAMS: MultiAgentTeam[] = [
  {
    id: 'team-sovereign-devs',
    name: 'KRONEX Sovereign Dev Team',
    description: 'Autonomous software engineering pod consisting of Architect, Developer, Data Analyst, and QA Inspector.',
    agentIds: ['agent-sovereign-core', 'agent-jarvis-dev', 'agent-quantum-analyst'],
    roles: {
      'agent-sovereign-core': 'Lead System Architect & Goal Planner',
      'agent-jarvis-dev': 'Full-Stack Code Implementation & Refactoring',
      'agent-quantum-analyst': 'Algorithm Verification & SQL Performance'
    },
    sharedMemory: [
      { id: 'sm-1', key: 'team_goal', value: 'Build Enterprise AI Agent Builder with 0 runtime bugs', category: 'Team Mission', updatedAt: '2026-07-21' },
      { id: 'sm-2', key: 'tech_consensus', value: 'React 19, Tailwind CSS v4, Motion, Lucide icons', category: 'Tech Stack', updatedAt: '2026-07-21' }
    ],
    status: 'idle'
  }
];


