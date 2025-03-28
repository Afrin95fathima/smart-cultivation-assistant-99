
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export function useCamera() {
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check camera permission on component mount
    checkCameraPermission();
    
    // Cleanup function to stop the camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      // Just check if we can get permission without starting the stream
      await navigator.mediaDevices.getUserMedia({ video: true });
      // If we get here, permission was granted previously
      setPermissionDenied(false);
    } catch (error) {
      console.log("Initial camera permission check:", error);
      // We don't set permissionDenied here as it might just be that the user hasn't been asked yet
    }
  };

  const startCamera = async () => {
    if (cameraActive) return; // Don't start camera if already active
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Camera access is not supported by this browser");
        return;
      }
      
      const constraints = {
        video: {
          facingMode: isMobile ? "environment" : "user", // Use rear camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        setPermissionDenied(false);
        toast.success("Camera started successfully");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setPermissionDenied(true);
      
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        toast.error("Camera permission denied. Please enable camera access in your browser settings.");
      } else {
        toast.error("Failed to access camera. Please check permissions or try a different browser.");
      }
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      // Stop camera if running
      if (cameraActive) {
        stopCamera();
      }
    }
  };

  return {
    cameraActive,
    permissionDenied,
    selectedImage,
    videoRef,
    canvasRef,
    setSelectedImage,
    startCamera,
    stopCamera,
    captureFromCamera,
    handleFileSelect
  };
}
