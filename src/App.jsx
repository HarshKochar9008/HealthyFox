import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import MedicalReport from "@/components/MedicalReport";

import {
  Upload,
  FileImage,
  Brain,
  Heart,
  AlertCircle,
  CheckCircle2,
  Download,
  ZoomIn,
  LucideFingerprint,
} from "lucide-react";
import {
  processImage,
  detectAnomalies,
  generateHeatmap,
} from "@/lib/imageProcessing";
import { downloadReport } from "@/lib/reportGenerator";
import { analyzeMedicalImage } from "@/lib/medicalAnalysis";

function App() {
  const [files, setFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [heatmapOverlay, setHeatmapOverlay] = useState(null);
  const [medicalAnalysis, setMedicalAnalysis] = useState(null);
  const { toast } = useToast();
  const imageRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setFiles(acceptedFiles);
      handleAnalysis(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".dcm"],
    },
    maxFiles: 1,
  });

  const handleAnalysis = async (file) => {
    setAnalyzing(true);
    setProgress(0);
    setAnalysisResult(null);
    setMedicalAnalysis(null);

    try {
      const processedImageData = await processImage(file);
      setProcessedImage(processedImageData.processedImageUrl);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      const anomalies = detectAnomalies(
        processedImageData.width,
        processedImageData.height
      );

      const heatmap = generateHeatmap(
        processedImageData.width,
        processedImageData.height,
        anomalies
      );
      setHeatmapOverlay(heatmap);

      const medicalFindings = anomalies.map(analyzeMedicalImage);

      setTimeout(() => {
        setAnalyzing(false);
        setAnalysisResult({ anomalies });
        setMedicalAnalysis(medicalFindings);
        toast({
          title: "Analysis Complete",
          description: `Detected ${anomalies.length} potential conditions.`,
          duration: 5000,
        });
      }, 5000);
    } catch (error) {
      console.error(error);
      toast({
        title: "Analysis Failed",
        description: "There was an error processing the image.",
        variant: "destructive",
        duration: 5000,
      });
      setAnalyzing(false);
    }
  };

  const handleDownloadReport = async () => {
    if (processedImage && medicalAnalysis) {
      try {
        await downloadReport(medicalAnalysis, processedImage);
        toast({
          title: "Report Downloaded",
          description:
            "Medical analysis report has been generated successfully.",
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "Failed to generate the report.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  };

  const scrollToUpload = () => {
    const el = document.getElementById("upload-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <header className="header">
        <span className="logo-title">
          <img src="/assets/logo.png" alt="HealthyFox Logo" style={{ height: 36, width: 36, marginRight: 12 }} />
          HealthyFox
        </span>
      </header>

      <section className="hero">
        <div className="hero-icon">
          <Brain className="w-12 h-12 text-blue-500" />
        </div>
        <h1 className="hero-title">HealthyFox - Your AI Medical Imaging Assistant</h1>
        <p className="hero-desc">
          Upload your medical images for instant, AI-powered analysis and diagnostic assistance. Fast, secure, and privacy-first.
        </p>
        <button className="cta-btn" onClick={scrollToUpload}>
          Get Started
        </button>
      </section>

      <div className="section">
        <div className="stepper">
          <div className="step">
            <div className="step-circle">1</div>
            <span className="text-blue-700 font-semibold">Upload</span>
          </div>
          <div className="step">
            <div className="step-circle">2</div>
            <span className="text-blue-700 font-semibold">Analyze</span>
          </div>
          <div className="step">
            <div className="step-circle">3</div>
            <span className="text-blue-700 font-semibold">Get Report</span>
          </div>
        </div>
      </div>

      <section className="section" id="upload-section">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="upload-card">
          <div {...getRootProps()} className="upload-area w-full">
            <input {...getInputProps()} />
            <Upload className="w-16 h-16 mb-4 text-blue-400" />
            <p className="text-gray-700 font-semibold text-lg">
              {isDragActive ? "Drop the files here..." : "Drag & drop medical images here, or click to select"}
            </p>
            <p className="text-sm text-gray-500 mt-2">Supports DICOM, PNG, JPEG formats</p>
          </div>
          {files.length > 0 && (
            <div className="w-full">
              <h3 className="font-semibold mb-2">Selected File:</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileImage className="w-4 h-4" />
                {files[0].name}
              </div>
            </div>
          )}
          {analyzing && (
            <div className="w-full">
              <div className="flex justify-between text-sm mb-2">
                <span>Analysis Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </motion.div>
      </section>

      <section className="section">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-8">What Can MedAI Analyze?</h2>
        <div className="capabilities-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="capability-feature">
            <Brain className="w-10 h-10 text-purple-500" />
            <h3 className="font-semibold text-lg">MRI Analysis</h3>
            <p className="text-sm text-gray-600 text-center">Detects neurological conditions and abnormalities</p>
          </div>
          <div className="capability-feature">
            <LucideFingerprint className="w-10 h-10 text-blue-500" />
            <h3 className="font-semibold text-lg">X-Ray Analysis</h3>
            <p className="text-sm text-gray-600 text-center">Detects pulmonary conditions and bone fractures</p>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {processedImage && (
          <section className="section">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="results-card">
              <div className="flex justify-between items-center w-full mb-4">
                <h2 className="text-2xl font-bold text-blue-700">Analysis Results</h2>
                {medicalAnalysis && (
                  <Button onClick={handleDownloadReport} className="primary-btn flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                )}
              </div>
              <div className="relative rounded-lg overflow-hidden w-full mb-4">
                <img ref={imageRef} src={processedImage} alt="Processed medical image" className="w-full h-auto rounded-lg" />
                {heatmapOverlay && (
                  <img src={heatmapOverlay} alt="Anomaly heatmap" className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-60" />
                )}
              </div>
              {medicalAnalysis && <MedicalReport analysis={medicalAnalysis} />}
            </motion.div>
          </section>
        )}
      </AnimatePresence>

      <footer className="footer">
        &copy; {new Date().getFullYear()} HealthyFox &mdash; Medical Image Analysis Platform. All rights reserved.
        <br />
        Made by <a href="https://github.com/harshkochar9008" target="_blank" rel="noopener noreferrer">Harsh Kochar</a>
      </footer>
      <Toaster />
    </div>
  );
}

export default App;
