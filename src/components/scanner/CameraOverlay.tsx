import { X, Image, Mic, Info, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const CameraOverlay = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  
  // API URL - update this to your deployed backend URL
  const API_URL = "http://localhost:8000";
  
  useEffect(() => {
    // Cleanup function to stop the camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Camera access is not supported by this browser");
        return;
      }
      
      const constraints = {
        video: {
          facingMode: isMobile ? "environment" : "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        toast.success("Camera started successfully");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };
  
  // Function to handle file selection from device
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      // Stop camera if running
      if (cameraActive) {
        stopCamera();
      }
    }
  };
  
  // Capture image from camera
  const captureFromCamera = () => {
    if (!cameraActive) {
      startCamera();
      return;
    }
    
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create File object from Blob
            const capturedImage = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
            setSelectedImage(capturedImage);
            
            // Stop camera after capturing
            stopCamera();
            
            toast.success("Image captured successfully");
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };
  
  // This function would be called when a user takes a picture or selects a file
  const handleCapture = async () => {
    if (cameraActive) {
      captureFromCamera();
      return;
    }
    
    if (!selectedImage) {
      // If no image is selected and camera is not active, start camera
      if (!cameraActive) {
        startCamera();
        return;
      }
      
      // Otherwise simulate for testing
      simulateCapture();
      return;
    }
    
    setIsScanning(true);
    toast.info("Processing image...");
    
    try {
      // Create a FormData object to send the image to the backend
      const formData = new FormData();
      formData.append('file', selectedImage);
      
      // Make the API call to the disease prediction endpoint
      const response = await fetch(`${API_URL}/predict-disease`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Process the response
      const result = await response.json();
      
      // Store the result in sessionStorage to pass to the result page
      sessionStorage.setItem('diseaseResult', JSON.stringify(result));
      
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
      // Sample response that mimics the API response format
      const sampleResult = {
        disease: "Bacterial Leaf Blight",
        confidence: 85.7,
        recommendations: "Apply copper-based bactericides. Ensure proper field drainage. Remove and destroy infected plants.",
        description: "Bacterial Leaf Blight is a serious rice disease caused by Xanthomonas oryzae that leads to wilting and yellowing of leaves.",
        symptoms: [
          "Yellow to white lesions along the leaf veins",
          "Lesions turn yellow to white as they develop",
          "Wilting of leaves in severe cases"
        ]
      };
      
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
            muted
          />
        ) : (
          <div className="text-white text-center p-4">
            <Camera size={48} className="mx-auto mb-2 opacity-50" />
            <p>Tap the button below to start camera</p>
            <p className="text-xs opacity-70 mt-1">or use the gallery icon to select an image</p>
          </div>
        )}
        
        {/* Hidden canvas for capturing images */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* AR Scanner Guide Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full flex flex-col">
          {/* Scanning frame */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-3/4 aspect-square rounded-3xl border-2 border-white/60 relative flex items-center justify-center">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-farming-green"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-farming-green"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-farming-green"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-farming-green"></div>
              
              {!selectedImage && !cameraActive && (
                <div className="text-white text-center">
                  <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center mb-2 pulse-ring">
                    <Mic className="text-white/90" size={24} />
                  </div>
                  <p className="text-sm font-medium">
                    {isScanning ? "Analyzing..." : "Ready to scan"}
                  </p>
                  <p className="text-xs opacity-80">Center the leaf in the frame</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Instruction text */}
          <div className="bg-black/50 backdrop-blur-sm p-4">
            <div className="flex items-start mb-2">
              <Info size={16} className="text-farming-gold mt-0.5 mr-2" />
              <p className="text-white text-sm flex-1">
                {selectedImage 
                  ? "Tap the button below to analyze the selected image" 
                  : cameraActive 
                    ? "Hold your camera steady over the affected plant part and tap to capture" 
                    : "Tap the button below to start camera"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute top-6 left-0 right-0 flex justify-between px-4">
        <Link to="/" className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <X className="text-white" size={20} />
        </Link>
        
        <label className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center cursor-pointer">
          <Image className="text-white" size={20} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      </div>
      
      {/* Bottom controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <button 
          onClick={cameraActive ? captureFromCamera : handleCapture}
          disabled={isScanning}
          className={`h-16 w-16 rounded-full bg-gradient-to-tr from-farming-green to-farming-green-light flex items-center justify-center shadow-lg glow-effect ${isScanning ? 'opacity-70' : ''}`}
        >
          <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
            <div className={`h-10 w-10 rounded-full bg-white/20 ${isScanning ? 'animate-pulse-fast' : 'animate-pulse-gentle'}`}></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CameraOverlay;
