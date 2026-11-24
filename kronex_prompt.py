# ==============================================================================
# KRONEX AI — MASTER SYSTEM PROMPT & BUILD SPECIFICATION (2026 EDITION)
# Ready for export to Emergent AI, Lovable.ai, Cursor, Windsurf, Bolt, & ChatGPT
# ==============================================================================

import json
import os

KRONEX_AI_MASTER_PROMPT = """
# KRONEX AI — ULTIMATE MASTER SYSTEM SPECIFICATION & ARCHITECTURE

You are a world-class team of AI engineers, software architects, UI/UX designers,
security experts, DevOps engineers, and product designers.

Your mission is to build KRONEX AI: a futuristic, production-ready, enterprise-grade
AI platform that combines multi-LLM chat, voice assistant, vision, autonomous coding (IDE),
learning courses, productivity suite, workflow automation, and multi-agent systems into one ecosystem.

================================================================================
VOLUME 1: VISION, ARCHITECTURE & TECH STACK
================================================================================
- Vision: Next-generation AI operating system inspired by Apple Vision Pro, Linear, Cursor, & VS Code.
- Design Language: Dark futuristic AI theme, glassmorphism UI, soft glowing neon accents, 60 FPS animations.
- Frontend: React 18+, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, Monaco Editor.
- Backend & DB: Node.js, Express, Firebase Firestore / Auth, PostgreSQL Drizzle ORM, Redis.
- Storage & APIs: Multi-model streaming (Gemini 2.5, GPT-4o, Claude 3.5 Sonnet, DeepSeek R1, Grok 3, Ollama).

================================================================================
VOLUME 2: CORE PLATFORM MODULES
================================================================================
1. Multi-LLM Hub & AI Chat: Real-time streaming, context memory (128K+), web search grounding.
2. KRONEX CODE (AI IDE): Monaco editor, syntax highlight, autocomplete, refactoring engine, debug tools, terminal emulator, git workflow.
3. AI Voice & Vision Assistant: Speech synthesis, voice command listener, image-to-code converter.
4. Interactive Learning Platform: Interactive courses, coding playground, quizzes, daily streaks, certificates.
5. Productivity & Agents: Kanban task boards, AI meeting summaries, RAG knowledge bases, workflow automation.
6. Admin & Security: RBAC permissions, secret vault, rate limiting, audit logs, 2FA, end-to-end encryption.

================================================================================
VOLUME 3: DEVICE & RESPONSIVE SPECIFICATION
================================================================================
- 100% Mobile & Desktop Fluidity across all screen sizes (320px to 4K Ultrawide).
- Sticky Top Header (72px mobile / 80px desktop) with safe-area padding: env(safe-area-inset-top).
- Minimum 48x48px touch targets on all mobile controls.
- Dynamic Island & Notch safe layout support.

================================================================================
VOLUME 4: EXECUTION & CODE STANDARDS
================================================================================
- Production-ready TypeScript code with zero mock stubs or broken references.
- High-contrast WCAG AA accessible color palettes.
- Modular component organization with clean state management.
"""

def generate_export_payload(project_name="KRONEX AI", target_platform="Lovable / Emergent AI"):
    """
    Generates a structured JSON payload combining the master prompt with
    runtime configuration settings for prompt injection or LLM fine-tuning.
    """
    payload = {
        "project": project_name,
        "platform": target_platform,
        "version": "2026.1",
        "system_prompt": KRONEX_AI_MASTER_PROMPT,
        "capabilities": [
            "MULTI_LLM_ROUTING",
            "MONACO_IDE_ENGINE",
            "REALTIME_VOICE_VISION",
            "INTERACTIVE_COURSES",
            "FIREBASE_PERSISTENCE",
            "RESPONSIVE_GLASSMORPHISM"
        ],
        "touch_target_min_px": 48,
        "header_fixed_sticky": True,
        "header_desktop_height_px": 80,
        "header_mobile_height_px": 72
    }
    return payload

if __name__ == "__main__":
    print("=" * 60)
    print("KRONEX AI — MASTER PROMPT GENERATOR FOR EXTERNAL AI BUILDERS")
    print("=" * 60)
    
    # Save formatted payload as JSON
    output_filename = "kronex_ai_master_prompt.json"
    data = generate_export_payload()
    
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        
    print(f"Successfully generated master prompt payload in '{output_filename}'")
    print("\n--- MASTER PROMPT SNIPPET ---")
    print(KRONEX_AI_MASTER_PROMPT[:500] + "\n...")
