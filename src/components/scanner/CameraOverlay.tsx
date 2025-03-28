
import { X, Image, Mic, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const CameraOverlay = () => {
  const [isScanning, setIsScanning] = useState(false);
  
  // This function would be called when a user takes a picture
  const handleCapture = async () => {
    setIsScanning(true);
    toast.info("Processing image...");
    
    try {
      // In a real implementation, this would get the actual camera image
      // For now we're simulating an API call
      
      // Here you would:
      // 1. Get the image from the camera
      // 2. Convert it to base64 or a blob
      // 3. Send it to your backend API
      
      // Simulated API call
      const response = await fetch('https://your-backend-url.com/predict-disease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // In a real implementation, this would be the base64 image
          image: "simulated_image_data",
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Process the response
      const result = await response.json();
      
      // Store the result in sessionStorage to pass to the result page
      sessionStorage.setItem('diseaseResult', JSON.stringify(result));
      
      // Navigate to result page
      window.location.href = '/scanner/result';
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="relative h-full w-full bg-black">
      {/* Camera Viewfinder - This would connect to actual camera in a real implementation */}
      <div className="h-full w-full bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>Camera preview would appear here</p>
          <p className="text-xs opacity-70 mt-1">(Camera permission required)</p>
        </div>
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
              
              <div className="text-white text-center">
                <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center mb-2 pulse-ring">
                  <Mic className="text-white/90" size={24} />
                </div>
                <p className="text-sm font-medium">
                  {isScanning ? "Analyzing..." : "Scanning..."}
                </p>
                <p className="text-xs opacity-80">Center the leaf in the frame</p>
              </div>
            </div>
          </div>
          
          {/* Instruction text */}
          <div className="bg-black/50 backdrop-blur-sm p-4">
            <div className="flex items-start mb-2">
              <Info size={16} className="text-farming-gold mt-0.5 mr-2" />
              <p className="text-white text-sm flex-1">
                Hold your camera steady over the affected plant part for best results
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
        
        <button className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <Image className="text-white" size={20} />
        </button>
      </div>
      
      {/* Bottom controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <button 
          onClick={handleCapture}
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
