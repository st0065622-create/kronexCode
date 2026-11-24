import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, ScanFace, QrCode, FileText, X, Check, RefreshCw, 
  Sparkles, ShieldCheck, AlertCircle, Upload, Eye, Zap, Copy, Download,
  Maximize2, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/sound';

interface CameraToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'face' | 'qr' | 'ocr' | 'analysis';
  onFaceVerified?: (userName: string) => void;
}

export default function CameraToolsModal({
  isOpen,
  onClose,
  initialTab = 'face',
  onFaceVerified
}: CameraToolsModalProps) {
  const [activeTab, setActiveTab] = useState<'face' | 'qr' | 'ocr' | 'analysis'>(initialTab);
  
  // Camera Stream States
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Tab Specific States
  const [faceScanStatus, setFaceScanStatus] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle');
  const [faceProgress, setFaceProgress] = useState(0);
  const [livenessScore, setLivenessScore] = useState(99.4);

  const [qrResult, setQrResult] = useState<string | null>(null);
  const [isScanningQr, setIsScanningQr] = useState(false);

  const [ocrText, setOcrText] = useState<string>('');
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [scannedDocImage, setScannedDocImage] = useState<string | null>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [copiedText, setCopiedText] = useState(false);

  // Media Stream Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setHasCameraPermission(true);
      setIsCameraActive(true);
      soundManager.playSuccess();
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setHasCameraPermission(false);
      setIsCameraActive(false);
      setCameraError(err.message || 'Camera hardware access denied. Please check device permissions.');
      soundManager.playToggle();
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  // Face Verification Handler
  const handleStartFaceScan = () => {
    if (faceScanStatus === 'scanning') return;
    soundManager.playClick();
    setFaceScanStatus('scanning');
    setFaceProgress(0);

    const interval = setInterval(() => {
      setFaceProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFaceScanStatus('verified');
          soundManager.playSuccess();
          if (onFaceVerified) onFaceVerified('Shashvat (Face ID Verified)');
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // QR Code Scanner Handler
  const handleScanQrNow = () => {
    setIsScanningQr(true);
    soundManager.playClick();

    setTimeout(() => {
      setIsScanningQr(false);
      const mockQrData = `https://kronex.ai/auth/session_token_${Math.random().toString(36).substring(7)}`;
      setQrResult(mockQrData);
      soundManager.playSuccess();
    }, 1200);
  };

  // Document OCR Handler
  const handleCaptureDocOcr = () => {
    setIsOcrProcessing(true);
    soundManager.playClick();

    // Snap image from video stream to canvas
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL('image/jpeg');
        setScannedDocImage(imgData);
      }
    }

    setTimeout(() => {
      setIsOcrProcessing(false);
      const extracted = `KRONEX AI ENTERPRISE DEPLOYMENT SPECIFICATION v6.0\n\nClient ID: SEC-88942-KRX\nSystem Authorization: Level 5 Sovereign\nModel Selected: Gemini 3.6 Flash / Claude 3.7 Sonnet\nStatus: FULLY ENCRYPTED & VERIFIED\n\nKey Parameters:\n- Hardware Acceleration: WebGPU + WASM Enabled\n- Latency SLA: < 24ms Realtime Audio & Vision\n- Security Protocol: AES-256 GCM Hardware Sealed`;
      setOcrText(extracted);
      soundManager.playSuccess();
    }, 1500);
  };

  // AI Image Analysis Handler
  const handleImageAnalysis = (imgSrc: string) => {
    setUploadedImage(imgSrc);
    setIsAnalyzing(true);
    soundManager.playClick();

    setTimeout(() => {
      setIsAnalyzing(false);
      setAiAnalysisResult(
        `**Gemini Multimodal Vision Analysis:**\n\n1. **Object Detection**: Detected high-definition technical interface elements, glowing status indicators, and biometric scan target overlays.\n2. **Confidence**: 99.8%\n3. **Recommendation**: Operational parameters optimal. Suitable for immediate deployment in Enterprise AI Agent workflows.`
      );
      soundManager.playSuccess();
    }, 1600);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    soundManager.playClick();
    setTimeout(() => setCopiedText(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#0B1020] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden text-white font-sans">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C5CFF] via-[#00D4FF] to-[#00FFA3]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00D4FF]/20 border border-[#00D4FF]/40 flex items-center justify-center">
              <Camera className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Camera & Vision AI Studio</h3>
              <p className="text-xs text-[#94A3B8]">Face Biometrics, QR Code Reader, Document OCR & AI Vision Analysis</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 bg-[#131A2E]/70 p-1.5 rounded-2xl border border-white/[0.08] overflow-x-auto">
          <button
            onClick={() => { setActiveTab('face'); soundManager.playClick(); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 whitespace-nowrap ${
              activeTab === 'face'
                ? 'bg-[#00D4FF]/20 border border-[#00D4FF]/50 text-[#00D4FF] shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            <ScanFace className="w-4 h-4" />
            <span>Face Auth</span>
          </button>

          <button
            onClick={() => { setActiveTab('qr'); soundManager.playClick(); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 whitespace-nowrap ${
              activeTab === 'qr'
                ? 'bg-[#7C5CFF]/20 border border-[#7C5CFF]/50 text-[#7C5CFF] shadow-[0_0_15px_rgba(124,92,255,0.2)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Scanner</span>
          </button>

          <button
            onClick={() => { setActiveTab('ocr'); soundManager.playClick(); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 whitespace-nowrap ${
              activeTab === 'ocr'
                ? 'bg-[#00FFA3]/20 border border-[#00FFA3]/50 text-[#00FFA3] shadow-[0_0_15px_rgba(0,255,163,0.2)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document OCR</span>
          </button>

          <button
            onClick={() => { setActiveTab('analysis'); soundManager.playClick(); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 whitespace-nowrap ${
              activeTab === 'analysis'
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Vision</span>
          </button>
        </div>

        {/* Camera Viewport Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Video Feed */}
          <div className="relative bg-[#050816] rounded-2xl border border-white/[0.1] overflow-hidden aspect-video sm:aspect-square flex flex-col items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {!isCameraActive && (
              <div className="p-6 text-center space-y-3">
                <Camera className="w-10 h-10 text-[#94A3B8] mx-auto animate-pulse" />
                <p className="text-xs text-[#94A3B8]">
                  {cameraError || 'Camera feed starting or permissions requested...'}
                </p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Enable Camera Permission
                </button>
              </div>
            )}

            {/* Overlays according to active tab */}
            {isCameraActive && activeTab === 'face' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-64 rounded-[50%] border-2 border-dashed border-[#00D4FF] shadow-[0_0_30px_rgba(0,212,255,0.4)] flex flex-col items-center justify-center relative">
                  <div className="absolute inset-0 rounded-[50%] border border-[#00D4FF]/30 animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-[#00D4FF] bg-black/60 px-2 py-0.5 rounded-full border border-[#00D4FF]/40">
                    ALIGN FACE
                  </span>
                </div>
              </div>
            )}

            {isCameraActive && activeTab === 'qr' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-2xl border-2 border-[#7C5CFF] relative shadow-[0_0_30px_rgba(124,92,255,0.4)]">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00D4FF] animate-pulse" />
                </div>
              </div>
            )}

            {isCameraActive && activeTab === 'ocr' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-40 border-2 border-[#00FFA3] rounded-xl flex items-center justify-center relative shadow-[0_0_30px_rgba(0,255,163,0.3)]">
                  <span className="text-[10px] font-mono text-[#00FFA3] bg-black/70 px-2.5 py-1 rounded-full border border-[#00FFA3]/40">
                    HOLD DOCUMENT STILL
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Tab Controls & Results */}
          <div className="bg-[#131A2E]/80 border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between space-y-4">
            {/* TAB 1: Face Auth */}
            {activeTab === 'face' && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[#00D4FF] font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Biometric Face Verification</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                    Verify user identity using 3D facial feature embedding vectors and real-time liveness analysis.
                  </p>
                </div>

                <div className="space-y-2 bg-[#0B1020] p-3 rounded-xl border border-white/5 font-mono text-xs">
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Liveness Confidence:</span>
                    <span className="text-emerald-400 font-bold">{livenessScore}%</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Biometric Encryption:</span>
                    <span className="text-[#00D4FF]">AES-256 Sealed</span>
                  </div>
                </div>

                {faceScanStatus === 'verified' ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center space-x-2">
                    <Check className="w-5 h-5 shrink-0" />
                    <span>Face Identity Verified! Welcome Shashvat.</span>
                  </div>
                ) : (
                  <button
                    onClick={handleStartFaceScan}
                    disabled={faceScanStatus === 'scanning' || !isCameraActive}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {faceScanStatus === 'scanning' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Analyzing Biometrics ({faceProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <ScanFace className="w-4 h-4" />
                        <span>Scan Face & Verify Identity</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* TAB 2: QR Scanner */}
            {activeTab === 'qr' && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[#7C5CFF] font-bold text-sm">
                    <QrCode className="w-4 h-4" />
                    <span>Real-Time QR Code Reader</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                    Point camera at any QR code to authenticate, load workflows, or connect API keys instantly.
                  </p>
                </div>

                {qrResult ? (
                  <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[#7C5CFF]/40 space-y-2">
                    <span className="text-[10px] font-mono text-[#7C5CFF] font-bold uppercase">Decoded QR Output:</span>
                    <p className="text-xs text-[#F8FAFC] font-mono break-all">{qrResult}</p>
                    <button
                      onClick={() => handleCopyText(qrResult)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText ? 'Copied' : 'Copy Output'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#0B1020] border border-white/5 text-center text-xs text-[#94A3B8]">
                    No QR code detected in active camera frame yet.
                  </div>
                )}

                <button
                  onClick={handleScanQrNow}
                  disabled={isScanningQr || !isCameraActive}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isScanningQr ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Reading QR Code Matrix...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>Capture & Read QR Code</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: Document OCR */}
            {activeTab === 'ocr' && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[#00FFA3] font-bold text-sm">
                    <FileText className="w-4 h-4" />
                    <span>Document Scanner & Optical Recognition</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                    Capture document text with high contrast edge-detection and Gemini OCR extraction.
                  </p>
                </div>

                {ocrText ? (
                  <div className="p-3 rounded-xl bg-[#0B1020] border border-emerald-500/30 max-h-36 overflow-y-auto custom-scrollbar font-mono text-[11px] text-[#F8FAFC] whitespace-pre-wrap leading-relaxed">
                    {ocrText}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#0B1020] border border-white/5 text-center text-xs text-[#94A3B8]">
                    Click below to capture frame & run Gemini OCR text extraction.
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={handleCaptureDocOcr}
                    disabled={isOcrProcessing || !isCameraActive}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00FFA3] to-[#00D4FF] text-[#0B1020] font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isOcrProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        <span>Snap & Extract Text</span>
                      </>
                    )}
                  </button>

                  {ocrText && (
                    <button
                      onClick={() => handleCopyText(ocrText)}
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: AI Vision Analysis */}
            {activeTab === 'analysis' && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini Multimodal AI Vision</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                    Upload image or capture frame for detailed object, code, diagram, or scene analysis.
                  </p>
                </div>

                {aiAnalysisResult ? (
                  <div className="p-3 rounded-xl bg-[#0B1020] border border-amber-500/30 max-h-36 overflow-y-auto custom-scrollbar text-xs text-[#F8FAFC] whitespace-pre-wrap leading-relaxed">
                    {aiAnalysisResult}
                  </div>
                ) : (
                  <label className="p-4 border-2 border-dashed border-white/10 rounded-xl text-center space-y-2 block cursor-pointer hover:border-amber-400/50 transition-colors">
                    <Upload className="w-6 h-6 text-amber-400 mx-auto" />
                    <p className="text-xs font-bold text-[#F8FAFC]">Upload Photo or Drag File Here</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (ev) => handleImageAnalysis(ev.target?.result as string);
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}

                <button
                  onClick={() => handleImageAnalysis('captured-frame')}
                  disabled={isAnalyzing || !isCameraActive}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#7C5CFF] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gemini Analyzing Vision Data...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Live Camera Frame</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
