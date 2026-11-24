#!/usr/bin/env python3
"""
================================================================================
KRONEX AI — PROJECT FILE AGGREGATOR & AI BUNDLER SCRIPT
================================================================================
This Python script scans the entire KRONEX AI codebase, reads source files 
(React TypeScript components, CSS stylesheets, configuration JSONs, Vite setups, 
data definitions, and environment templates), and packages them into a clean, 
structured prompt output file (`kronex_project_bundle.txt`).

The resulting text file can be easily copy-pasted directly into AI builders 
like Lovable.dev, Emergent AI, Cursor, Windsurf, ChatGPT, or Claude.
================================================================================
"""

import os
import json
import sys
from pathlib import Path

# Target file extension rules for filtering project source files
TEXT_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".html", ".md", ".py", ".env", ".example"
}

# Directories and files to ignore during directory traversal
IGNORE_DIRS = {
    "node_modules", "dist", ".git", ".aistudio", ".vite", "__pycache__", ".vscode"
}

IGNORE_FILES = {
    "bun.lock", "package-lock.json", "yarn.lock", "pnpm-lock.yaml"
}

def is_text_file(filepath: Path) -> bool:
    """
    Determines if a given file is a readable source code or configuration file
    by evaluating its file extension.
    """
    if filepath.name in IGNORE_FILES:
        return False
    # Handle files like .env.example
    if filepath.suffix in TEXT_EXTENSIONS or filepath.name.startswith(".env"):
        return True
    return False

def format_file_block(relative_path: str, content: str) -> str:
    """
    Formats an individual file's path and code content into a clean XML-tagged 
    block for LLM consumption (Lovable / Emergent AI compatible).
    """
    # Detect language for syntax highlighting hints
    ext = Path(relative_path).suffix.lstrip('.')
    lang_map = {
        'tsx': 'tsx',
        'ts': 'typescript',
        'css': 'css',
        'json': 'json',
        'html': 'html',
        'py': 'python',
        'md': 'markdown'
    }
    lang = lang_map.get(ext, '')

    return f"""
================================================================================
FILE: {relative_path}
================================================================================
```{lang}
{content.strip()}
```
"""

def aggregate_project(root_dir: str = ".", output_file: str = "kronex_project_bundle.txt"):
    """
    Parses the repository directory structure, classifies each file type, reads content,
    and aggregates everything into a single structured output text file.
    """
    project_path = Path(root_dir).resolve()
    print(f"🔍 Starting aggregation from root directory: {project_path}")

    aggregated_files = []
    total_files = 0
    total_lines = 0

    # 1. TRAVERSE DIRECTORY TREE
    for current_root, dirs, files in os.walk(project_path):
        # Prune ignored directories in-place so os.walk skips descending into them
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file_name in sorted(files):
            file_path = Path(current_root) / file_name
            relative_path = file_path.relative_to(project_path).as_posix()

            # Filter out non-code assets (e.g. binary images) and ignored files
            if not is_text_file(file_path):
                continue

            # 2. PARSE FILE CONTENT BY TYPE
            try:
                with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                    content = f.read()

                # Calculate stats
                lines_count = len(content.splitlines())
                total_lines += lines_count
                total_files += 1

                print(f"  ✓ Processed [{ext_label(file_path)}]: {relative_path} ({lines_count} lines)")

                # Format file content into structured block
                formatted_block = format_file_block(relative_path, content)
                aggregated_files.append((relative_path, formatted_block))

            except Exception as err:
                print(f"  ⚠️ Error reading file {relative_path}: {err}", file=sys.stderr)

    # 3. CONSTRUCT SYSTEM PROMPT HEADER FOR LOVABLE & EMERGENT AI
    header = f"""# KRONEX AI — FULL PROJECT SOURCE CODE BUNDLE
# Generated for: Emergent AI, Lovable.ai, Cursor, & ChatGPT Import
# Total Files Included: {total_files}
# Total Lines of Code: {total_lines}
# Design Theme: Dark Futuristic AI / Glassmorphism UI / Multi-LLM Operating System

Instructions for AI Platform:
- The following code bundle represents the entire production codebase for KRONEX AI.
- Use this code as context to rebuild, extend, deploy, or refactor the application.
- Maintain the top navigation sticky header, safe-area mobile responsiveness, and 48x48px touch targets.
- Retain the profile identity for THE SHASHVAT (Creator & Lead Architect).

================================================================================
PROJECT FILE INDEX ({total_files} files)
================================================================================
""" + "\n".join([f"- {path}" for path, _ in aggregated_files]) + "\n\n"

    # 4. WRITE EVERYTHING TO FINAL BUNDLE FILE
    output_path = project_path / output_file
    with open(output_path, "w", encoding="utf-8") as out:
        out.write(header)
        for _, formatted_block in aggregated_files:
            out.write(formatted_block)

    print("\n" + "=" * 60)
    print(f"🎉 AGGREGATION COMPLETE!")
    print(f"📦 Total Files Packaged: {total_files}")
    print(f"📝 Total Lines of Code: {total_lines}")
    print(f"💾 Saved output file to: {output_path}")
    print("=" * 60)
    print("👉 You can now copy and paste the contents of 'kronex_project_bundle.txt' into Emergent AI or Lovable.ai!")

def ext_label(filepath: Path) -> str:
    """Returns a short human-readable tag based on the file type."""
    ext = filepath.suffix.lower()
    if ext in [".tsx", ".jsx"]:
        return "React Component"
    elif ext in [".ts", ".js"]:
        return "TypeScript/JS Logic"
    elif ext == ".css":
        return "CSS Styling"
    elif ext == ".json":
        return "Config/Data JSON"
    elif ext == ".html":
        return "HTML Entry"
    elif ext == ".py":
        return "Python Script"
    else:
        return "Text Document"

if __name__ == "__main__":
    aggregate_project()
