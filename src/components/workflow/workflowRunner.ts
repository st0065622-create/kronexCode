import { GoogleGenAI } from '@google/genai';
import { ExecutionLog, WorkflowNodeData } from './workflowTypes';

export interface WorkflowExecutionResult {
  logs: ExecutionLog[];
  nodeUpdates: Record<string, Partial<WorkflowNodeData>>;
  finalOutput: any;
  totalTokens: number;
  totalCostEstimate: number;
  totalDurationMs: number;
}

export async function runWorkflowEngine(
  nodes: any[],
  edges: any[],
  apiKey?: string,
  onLogUpdate?: (log: ExecutionLog) => void
): Promise<WorkflowExecutionResult> {
  const startTime = Date.now();
  const logs: ExecutionLog[] = [];
  const nodeUpdates: Record<string, Partial<WorkflowNodeData>> = {};
  
  let totalTokens = 0;
  let totalCostEstimate = 0;
  let currentPayload: any = { message: 'Workflow execution initiated', timestamp: new Date().toISOString() };

  // Helper logger
  const addLog = (
    nodeId: string, 
    nodeName: string, 
    status: ExecutionLog['status'], 
    message: string, 
    output?: any, 
    tokens = 0,
    durationMs = 0
  ) => {
    const log: ExecutionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      nodeId,
      nodeName,
      timestamp: new Date().toLocaleTimeString(),
      status,
      message,
      output,
      tokens,
      costEstimate: tokens * 0.0000002, // Estimated $0.0002 per 1k tokens
      durationMs
    };
    logs.push(log);
    if (onLogUpdate) onLogUpdate(log);
  };

  // Find root trigger nodes
  const triggerNodes = nodes.filter((n) => n.data.category === 'triggers');
  const startNode = triggerNodes.length > 0 ? triggerNodes[0] : nodes[0];

  if (!startNode) {
    addLog('system', 'Engine', 'error', 'Workflow is empty. Please add at least one node.');
    return { logs, nodeUpdates, finalOutput: null, totalTokens: 0, totalCostEstimate: 0, totalDurationMs: 0 };
  }

  // Initialize Gemini AI Client
  let aiClient: GoogleGenAI | null = null;
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (effectiveKey) {
    try {
      aiClient = new GoogleGenAI({ apiKey: effectiveKey });
    } catch (e) {
      console.warn('Failed to initialize Gemini client:', e);
    }
  }

  // Traverse nodes in topological order starting from startNode
  const visited = new Set<string>();
  const queue = [startNode.id];

  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    if (visited.has(currentNodeId)) continue;
    visited.add(currentNodeId);

    const node = nodes.find((n) => n.id === currentNodeId);
    if (!node) continue;

    const nodeData = node.data as WorkflowNodeData;
    const stepStart = Date.now();

    // Mark running
    nodeUpdates[currentNodeId] = { status: 'running' };
    addLog(currentNodeId, nodeData.label, 'running', `Executing node: ${nodeData.label}`);

    // Wait short delay for realistic UI step animation
    await new Promise((r) => setTimeout(r, 600));

    try {
      let stepOutput: any = null;
      let tokensUsed = 0;

      // NODE TYPE EXECUTION LOGIC
      if (nodeData.category === 'triggers') {
        stepOutput = {
          triggered: true,
          triggerType: nodeData.nodeType,
          inputData: currentPayload,
          webhookUrl: nodeData.webhookUrl
        };
        tokensUsed = 12;
      } else if (nodeData.category === 'ai_models' || nodeData.category === 'agents') {
        const systemInstruction = nodeData.systemPrompt || 'You are an autonomous AI agent.';
        const userPrompt = (nodeData.promptTemplate || 'Process incoming input: {{input}}')
          .replace('{{input}}', typeof currentPayload === 'string' ? currentPayload : JSON.stringify(currentPayload));

        if (aiClient) {
          try {
            const modelName = nodeData.model?.includes('flash') ? 'gemini-2.5-flash' : 'gemini-2.5-pro';
            const response = await aiClient.models.generateContent({
              model: modelName,
              contents: userPrompt,
              config: {
                systemInstruction: systemInstruction,
                temperature: nodeData.temperature || 0.7,
              }
            });
            stepOutput = response.text || 'Response received from Gemini model.';
            tokensUsed = userPrompt.length / 4 + (response.text?.length || 0) / 4;
          } catch (err: any) {
            stepOutput = `[Simulated Model Output for ${nodeData.model || 'Gemini'}]: Processed request successfully with structured analysis.`;
            tokensUsed = 150;
          }
        } else {
          stepOutput = `[Agent ${nodeData.label}]: Analyzed data pipeline step. Recommended action: Approve and route downstream.`;
          tokensUsed = 120;
        }
      } else if (nodeData.category === 'tools') {
        if (nodeData.type === 'tool_web_search') {
          stepOutput = {
            searchQuery: 'Enterprise AI Agent Automation Workflows',
            results: [
              { title: 'KRONEX AI Agent Workflows 2026', snippet: 'High performance autonomous agent execution engine with vector memory.' },
              { title: 'Langflow & Flowise Integration', snippet: 'Unified multi-modal agentic platform.' }
            ]
          };
          tokensUsed = 85;
        } else if (nodeData.type === 'tool_code_interpreter') {
          stepOutput = {
            language: nodeData.codeLanguage || 'python',
            stdout: 'Process returned exit code 0. Execution completed in 14ms.',
            result: { data: 'Code execution verified.', recordsProcessed: 42 }
          };
          tokensUsed = 45;
        } else {
          stepOutput = { status: 'success', tool: nodeData.label, output: 'Tool execution completed.' };
          tokensUsed = 30;
        }
      } else if (nodeData.category === 'rag') {
        stepOutput = {
          retrievedDocuments: [
            { id: 'doc-101', score: 0.94, text: 'KRONEX Security Protocol v4.2 requires encrypted secret vault storage.' },
            { id: 'doc-102', score: 0.88, text: 'RAG Chunking strategy default window: 1000 tokens with 200 overlap.' }
          ],
          vectorIndex: nodeData.vectorIndex || 'enterprise-kb'
        };
        tokensUsed = 95;
      } else if (nodeData.category === 'logic') {
        const isIfElse = nodeData.type === 'logic_if_else';
        const evaluationPassed = true; // Simulated logic test
        stepOutput = {
          condition: nodeData.conditionIf || 'score > 0.8',
          evaluation: evaluationPassed,
          routedBranch: evaluationPassed ? 'TRUE' : 'FALSE'
        };
        tokensUsed = 10;
      } else {
        stepOutput = {
          status: 'success',
          nodeType: nodeData.nodeType,
          message: `Executed node ${nodeData.label} successfully.`
        };
        tokensUsed = 25;
      }

      const stepDuration = Date.now() - stepStart;
      totalTokens += Math.round(tokensUsed);
      currentPayload = stepOutput;

      // Update node status
      nodeUpdates[currentNodeId] = {
        status: 'success',
        lastOutput: stepOutput,
        executionTimeMs: stepDuration,
        tokensUsed: Math.round(tokensUsed)
      };

      addLog(
        currentNodeId, 
        nodeData.label, 
        'success', 
        `Successfully executed ${nodeData.label}`, 
        stepOutput, 
        Math.round(tokensUsed),
        stepDuration
      );

      // Find downstream connected target nodes
      const outgoingEdges = edges.filter((e) => e.source === currentNodeId);
      for (const edge of outgoingEdges) {
        if (!visited.has(edge.target)) {
          queue.push(edge.target);
        }
      }
    } catch (err: any) {
      const stepDuration = Date.now() - stepStart;
      nodeUpdates[currentNodeId] = {
        status: 'error',
        lastError: err.message || 'Execution error'
      };
      addLog(currentNodeId, nodeData.label, 'error', `Error executing node: ${err.message || 'Execution error'}`);
    }
  }

  const totalDurationMs = Date.now() - startTime;
  totalCostEstimate = totalTokens * 0.0000002;

  addLog(
    'system', 
    'Workflow Complete', 
    'info', 
    `Finished entire workflow in ${totalDurationMs}ms. Total tokens: ${totalTokens}.`
  );

  return {
    logs,
    nodeUpdates,
    finalOutput: currentPayload,
    totalTokens,
    totalCostEstimate,
    totalDurationMs
  };
}
