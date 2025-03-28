import { useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useCamera } from "@/hooks/use-camera";
import { TopControls, BottomControl } from "@/components/scanner/ScannerControls";
import ScannerFrame from "@/components/scanner/ScannerFrame";
import InfoPanel from "@/components/scanner/InfoPanel";
import { predictDisease, simulateDiseaseResult } from "@/services/disease-service";

const CameraOverlay = () => {
  const [isScanning, setIsScanning] = useState(false);
  const {
    cameraActive,
    permissionDenied,
    selectedImage,
    videoRef,
    canvasRef,
    captureFromCamera,
    handleFileSelect
  } = useCamera();
  
  // This function would be called when a user takes a picture or selects a file
  const handleCapture = async () => {
    if (cameraActive) {
      captureFromCamera();
      return;
    }
    
    if (!selectedImage) {
      // If no image is selected and camera is not active, start camera
      if (!cameraActive) {
        captureFromCamera(); // This will start the camera
        return;
      }
      
      // Otherwise simulate for testing
      simulateCapture();
      return;
    }
    
    setIsScanning(true);
    toast.info("Processing image...");
    
    try {
      // Call the API service
      const result = await predictDisease(selectedImage);
      
      if (result) {
        // Store the result in sessionStorage to pass to the result page
        sessionStorage.setItem('diseaseResult', JSON.stringify(result));
      } else {
        // If API call failed, use simulated data
        simulateCapture();
        return;
      }
      
      // Navigate to result page
      window.location.href = '/scanner/result';
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to process image. Using simulated data instead.");
      simulateCapture();
    } finally {
      setIsScanning(false);
    }
  };

  // Simulate API call for testing or when camera/image selection isn't available
  const simulateCapture = () => {
    setIsScanning(true);
    toast.info("Processing image...");
    
    setTimeout(() => {
      // Use the simulated result
      const sampleResult = simulateDiseaseResult();
      
      // Store the result in sessionStorage
      sessionStorage.setItem('diseaseResult', JSON.stringify(sampleResult));
      
      // Navigate to result page
      window.location.href = '/scanner/result';
      
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="relative h-full w-full bg-black">
      {/* Camera Viewfinder */}
      <div className="h-full w-full bg-black flex items-center justify-center">
        {selectedImage ? (
          <img 
            src={URL.createObjectURL(selectedImage)} 
            alt="Selected plant" 
            className="h-full w-full object-contain" 
          />
        ) : cameraActive ? (
          <video 
            ref={videoRef} 
            className="h-full w-full object-cover" 
            playsInline 
            autoPlay
            muted
          />
        ) : (
          <div className="text-white text-center p-4">
            <Camera size={48} className="mx-auto mb-2 opacity-50" />
            <p>{permissionDenied ? "Camera access denied" : "Tap the button below to start camera"}</p>
            <p className="text-xs opacity-70 mt-1">
              {permissionDenied 
                ? "Please check browser settings to enable camera" 
                : "or use the gallery icon to select an image"}
            </p>
          </div>
        )}
        
        {/* Hidden canvas for capturing images */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* AR Scanner Guide Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full flex flex-col">
          {/* Scanning frame */}
          <ScannerFrame 
            selectedImage={selectedImage} 
            cameraActive={cameraActive} 
            isScanning={isScanning} 
          />
          
          {/* Instruction text */}
          <InfoPanel 
            selectedImage={selectedImage} 
            cameraActive={cameraActive} 
            permissionDenied={permissionDenied} 
          />
        </div>
      </div>
      
      {/* Top Controls */}
      <TopControls onFileSelect={handleFileSelect} />
      
      {/* Bottom control */}
      <BottomControl 
        onCapture={handleCapture} 
        cameraActive={cameraActive} 
        isScanning={isScanning} 
      />
    </div>
  );
};

export default CameraOverlay;
