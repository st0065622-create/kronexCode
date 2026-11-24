import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  Panel
} from '@xyflow/react';

import { nodeTypes } from './CustomNodes';
import NodePalette from './NodePalette';
import NodeInspector from './NodeInspector';
import WorkflowToolbar from './WorkflowToolbar';
import DebugConsole from './DebugConsole';
import ApiManagerModal from './ApiManagerModal';
import TemplatesModal from './TemplatesModal';
import VersionHistoryModal from './VersionHistoryModal';
import AttachmentManagerModal from './AttachmentManagerModal';

import { 
  WorkflowNodeData, 
  NodeDefinition, 
  ExecutionLog, 
  WorkflowVersion, 
  WorkflowTemplate, 
  WorkflowAttachment 
} from './workflowTypes';
import { runWorkflowEngine } from './workflowRunner';

// Initial default node setup
const INITIAL_NODES: Node[] = [
  {
    id: 'trigger-1',
    type: 'workflowNode',
    position: { x: 100, y: 220 },
    data: {
      label: 'Chat Prompt Trigger',
      category: 'triggers',
      nodeType: 'trigger_chat',
      description: 'Activates on user prompt submission',
      color: '#00D4FF',
      iconName: 'MessageSquare',
      status: 'idle'
    }
  },
  {
    id: 'model-1',
    type: 'workflowNode',
    position: { x: 480, y: 220 },
    data: {
      label: 'Google Gemini 2.5 Flash',
      category: 'ai_models',
      nodeType: 'model_gemini',
      model: 'gemini-2.5-flash',
      temperature: 0.7,
      systemPrompt: 'You are an enterprise AI agent automating workflow tasks.',
      color: '#7C5CFF',
      iconName: 'Sparkles',
      status: 'idle'
    }
  },
  {
    id: 'agent-1',
    type: 'workflowNode',
    position: { x: 860, y: 220 },
    data: {
      label: 'Research & Code Agent',
      category: 'agents',
      nodeType: 'agent_research',
      agentRole: 'Enterprise Data Analyst',
      description: 'Synthesizes insights and formats structured JSON',
      color: '#F59E0B',
      iconName: 'Bot',
      status: 'idle'
    }
  }
];

const INITIAL_EDGES: Edge[] = [
  {
    id: 'e-trigger-model',
    source: 'trigger-1',
    target: 'model-1',
    animated: true,
    style: { stroke: '#00D4FF', strokeWidth: 2 }
  },
  {
    id: 'e-model-agent',
    source: 'model-1',
    target: 'agent-1',
    animated: true,
    style: { stroke: '#7C5CFF', strokeWidth: 2 }
  }
];

function WorkflowBuilderContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  
  const [workflowName, setWorkflowName] = useState('Enterprise Agent Pipeline');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // UI Drawer & Modal States
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isDebugConsoleOpen, setIsDebugConsoleOpen] = useState(true);
  const [isApiManagerOpen, setIsApiManagerOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [attachmentModalNodeId, setAttachmentModalNodeId] = useState<string | null>(null);

  // Execution & Logs State
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalCostEstimate, setTotalCostEstimate] = useState(0);
  const [totalDurationMs, setTotalDurationMs] = useState(0);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  // Versions Snapshot
  const [versions, setVersions] = useState<WorkflowVersion[]>([
    {
      id: 'ver-1',
      versionNumber: 1,
      label: 'Initial Architecture',
      description: 'Default Gemini + Agent Pipeline',
      timestamp: new Date().toLocaleTimeString(),
      author: 'Enterprise Admin',
      nodesCount: INITIAL_NODES.length,
      edgesCount: INITIAL_EDGES.length,
      snapshot: { nodes: INITIAL_NODES, edges: INITIAL_EDGES }
    }
  ]);

  const reactFlowInstance = useReactFlow();

  // Save current state to undo history stack
  const recordHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyPointer + 1);
      return [...sliced, { nodes: newNodes, edges: newEdges }];
    });
    setHistoryPointer((prev) => prev + 1);
  }, [historyPointer]);

  // Connect edges callback
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const nextEdges = addEdge(
          { ...params, animated: true, style: { stroke: '#00D4FF', strokeWidth: 2 } },
          eds
        );
        recordHistory(nodes, nextEdges);
        return nextEdges;
      });
    },
    [setEdges, nodes, recordHistory]
  );

  // Handle node selection callback
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Open Inspector
  const handleOpenInspector = useCallback((id: string) => {
    setSelectedNodeId(id);
  }, []);

  // Run single node test
  const handleRunSingleNode = useCallback(async (id: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, data: { ...n.data, status: 'running' } } : n))
    );

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                data: {
                  ...n.data,
                  status: 'success',
                  lastOutput: `Single node test executed successfully at ${new Date().toLocaleTimeString()}`,
                  executionTimeMs: 142
                }
              }
            : n
        )
      );
    }, 800);
  }, [setNodes]);

  // Inject callbacks into node data
  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onOpenInspector: handleOpenInspector,
          onRunSingleNode: handleRunSingleNode
        }
      }))
    );
  }, [handleOpenInspector, handleRunSingleNode, setNodes]);

  // Drag and drop node insertion
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowData = event.dataTransfer.getData('application/reactflow');
      if (!reactFlowData) return;

      const def: NodeDefinition = JSON.parse(reactFlowData);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      const newNodeId = `node-${Date.now()}`;
      const newNode: Node = {
        id: newNodeId,
        type: 'workflowNode',
        position,
        data: {
          label: def.label,
          category: def.category,
          nodeType: def.type,
          description: def.description,
          color: def.color,
          iconName: def.iconName,
          status: 'idle',
          ...def.defaultData
        }
      };

      setNodes((nds) => {
        const updated = [...nds, newNode];
        recordHistory(updated, edges);
        return updated;
      });
      setSelectedNodeId(newNodeId);
    },
    [reactFlowInstance, setNodes, edges, recordHistory]
  );

  // Click to add node from palette
  const handleAddNodeFromPalette = (def: NodeDefinition) => {
    const newNodeId = `node-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'workflowNode',
      position: {
        x: 350 + Math.random() * 80,
        y: 200 + Math.random() * 80
      },
      data: {
        label: def.label,
        category: def.category,
        nodeType: def.type,
        description: def.description,
        color: def.color,
        iconName: def.iconName,
        status: 'idle',
        ...def.defaultData
      }
    };

    setNodes((nds) => {
      const updated = [...nds, newNode];
      recordHistory(updated, edges);
      return updated;
    });
    setSelectedNodeId(newNodeId);
  };

  // Node Inspector updates
  const handleUpdateNodeData = (id: string, newData: Partial<WorkflowNodeData>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...newData } } : n))
    );
  };

  const handleDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeId(null);
  };

  const handleDuplicateNode = (id: string) => {
    const sourceNode = nodes.find((n) => n.id === id);
    if (!sourceNode) return;

    const dupId = `node-dup-${Date.now()}`;
    const dupNode: Node = {
      ...sourceNode,
      id: dupId,
      position: {
        x: sourceNode.position.x + 40,
        y: sourceNode.position.y + 40
      },
      data: {
        ...sourceNode.data,
        label: `${sourceNode.data.label} (Copy)`
      }
    };

    setNodes((nds) => [...nds, dupNode]);
    setSelectedNodeId(dupId);
  };

  // Execute Entire Workflow
  const handleRunWorkflow = async () => {
    setIsRunning(true);
    setIsDebugConsoleOpen(true);

    const result = await runWorkflowEngine(
      nodes,
      edges,
      undefined,
      (newLog) => {
        setExecutionLogs((prev) => [...prev, newLog]);
      }
    );

    // Apply Node Updates
    setNodes((nds) =>
      nds.map((n) => {
        const update = result.nodeUpdates[n.id];
        return update ? { ...n, data: { ...n.data, ...update } } : n;
      })
    );

    setTotalTokens(result.totalTokens);
    setTotalCostEstimate(result.totalCostEstimate);
    setTotalDurationMs(result.totalDurationMs);
    setIsRunning(false);
  };

  // Template Loader
  const handleSelectTemplate = (template: WorkflowTemplate) => {
    setNodes(template.nodes);
    setEdges(template.edges);
    setWorkflowName(template.title);
    setExecutionLogs([]);
  };

  // Export JSON
  const handleExportWorkflow = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ name: workflowName, nodes, edges }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${workflowName.toLowerCase().replace(/\s+/g, '-')}-workflow.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportWorkflow = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.nodes && parsed.edges) {
            setNodes(parsed.nodes);
            setEdges(parsed.edges);
            if (parsed.name) setWorkflowName(parsed.name);
          }
        } catch (err) {
          console.error('Invalid workflow JSON file:', err);
        }
      };
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyPointer > 0) {
      const prev = history[historyPointer - 1];
      setNodes(prev.nodes);
      setEdges(prev.edges);
      setHistoryPointer(historyPointer - 1);
    }
  };

  const handleRedo = () => {
    if (historyPointer < history.length - 1) {
      const next = history[historyPointer + 1];
      setNodes(next.nodes);
      setEdges(next.edges);
      setHistoryPointer(historyPointer + 1);
    }
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="w-full h-screen bg-[#080C18] flex flex-col overflow-hidden select-none font-sans text-white">
      {/* Top Header & Control Toolbar */}
      <WorkflowToolbar
        workflowName={workflowName}
        onUpdateWorkflowName={setWorkflowName}
        onRunWorkflow={handleRunWorkflow}
        isRunning={isRunning}
        onTogglePalette={() => setIsPaletteOpen(!isPaletteOpen)}
        isPaletteOpen={isPaletteOpen}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenApiManager={() => setIsApiManagerOpen(true)}
        onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
        onToggleDebugConsole={() => setIsDebugConsoleOpen(!isDebugConsoleOpen)}
        isDebugConsoleOpen={isDebugConsoleOpen}
        onExportWorkflow={handleExportWorkflow}
        onImportWorkflow={handleImportWorkflow}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyPointer > 0}
        canRedo={historyPointer < history.length - 1}
        onZoomIn={() => reactFlowInstance.zoomIn()}
        onZoomOut={() => reactFlowInstance.zoomOut()}
        onFitView={() => reactFlowInstance.fitView({ padding: 0.2 })}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Node Library Drawer */}
        <NodePalette
          isOpen={isPaletteOpen}
          onClose={() => setIsPaletteOpen(false)}
          onAddNode={handleAddNodeFromPalette}
        />

        {/* Center Canvas */}
        <div 
          className="flex-1 h-full relative"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            defaultEdgeOptions={{ animated: true }}
            className="bg-[#080C18]"
          >
            {/* Grid Dots / Lines */}
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={24} 
              size={1.5} 
              color="rgba(255, 255, 255, 0.12)" 
            />

            {/* Minimap Overlay */}
            <MiniMap
              zoomable
              pannable
              nodeColor={(n) => (n.data as WorkflowNodeData).color || '#7C5CFF'}
              maskColor="rgba(8, 12, 24, 0.85)"
              className="!bg-[#0B1020]/90 !border !border-white/[0.1] !rounded-2xl !shadow-2xl overflow-hidden !bottom-4 !right-4"
            />

            <Controls className="!bg-[#0B1020]/90 !border !border-white/[0.1] !rounded-xl !text-white" />
          </ReactFlow>
        </div>

        {/* Right Node Inspector Panel */}
        {selectedNode && (
          <NodeInspector
            nodeId={selectedNode.id}
            data={selectedNode.data as WorkflowNodeData}
            onUpdateData={handleUpdateNodeData}
            onDeleteNode={handleDeleteNode}
            onDuplicateNode={handleDuplicateNode}
            onRunSingleNode={handleRunSingleNode}
            onClose={() => setSelectedNodeId(null)}
            onOpenAttachmentModal={(nodeId) => setAttachmentModalNodeId(nodeId)}
          />
        )}
      </div>

      {/* Bottom Realtime Execution Console */}
      <DebugConsole
        logs={executionLogs}
        onClearLogs={() => setExecutionLogs([])}
        isOpen={isDebugConsoleOpen}
        onClose={() => setIsDebugConsoleOpen(false)}
        totalTokens={totalTokens}
        totalCostEstimate={totalCostEstimate}
        totalDurationMs={totalDurationMs}
      />

      {/* MODALS */}
      <ApiManagerModal
        isOpen={isApiManagerOpen}
        onClose={() => setIsApiManagerOpen(false)}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <VersionHistoryModal
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        versions={versions}
        onRestoreVersion={(ver) => {
          setNodes(ver.snapshot.nodes);
          setEdges(ver.snapshot.edges);
        }}
      />

      {attachmentModalNodeId && (
        <AttachmentManagerModal
          isOpen={!!attachmentModalNodeId}
          onClose={() => setAttachmentModalNodeId(null)}
          nodeId={attachmentModalNodeId}
          attachments={
            (nodes.find((n) => n.id === attachmentModalNodeId)?.data as WorkflowNodeData)?.attachments || []
          }
          onAddAttachments={(newFiles) => {
            const current = (nodes.find((n) => n.id === attachmentModalNodeId)?.data as WorkflowNodeData)?.attachments || [];
            handleUpdateNodeData(attachmentModalNodeId, { attachments: [...current, ...newFiles] });
          }}
          onRemoveAttachment={(fileId) => {
            const current = (nodes.find((n) => n.id === attachmentModalNodeId)?.data as WorkflowNodeData)?.attachments || [];
            handleUpdateNodeData(attachmentModalNodeId, { attachments: current.filter((f) => f.id !== fileId) });
          }}
        />
      )}
    </div>
  );
}

export default function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderContent />
    </ReactFlowProvider>
  );
}
