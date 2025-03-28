
import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import CameraOverlay from "@/components/scanner/CameraOverlay";
import { toast } from "sonner";

const Scanner = () => {
  const [hasCheckedPermission, setHasCheckedPermission] = useState(false);

  useEffect(() => {
    // Prevent scrolling on this page
    document.body.style.overflow = "hidden";
    
    // Check if browser supports camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Camera not supported by your browser");
      return;
    }
    
    // Check camera permission status only once
    if (!hasCheckedPermission) {
      checkCameraPermission();
      setHasCheckedPermission(true);
    }
    
    return () => {
      document.body.style.overflow = "";
      // Ensure any open camera is closed when navigating away
      const videoElements = document.querySelectorAll('video');
      videoElements.forEach(video => {
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          video.srcObject = null;
        }
      });
    };
  }, [hasCheckedPermission]);

  const checkCameraPermission = async () => {
    try {
      // Just check permission without actually starting the stream
      await navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          // Immediately stop the stream since we're just checking permission
          stream.getTracks().forEach(track => track.stop());
        });
    } catch (error) {
      console.log("Permission check error:", error);
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        toast.error("Camera access denied. Please check browser settings.");
      }
    }
  };

  return (
    <PageContainer showNav={false} className="h-screen overflow-hidden">
      <CameraOverlay />
    </PageContainer>
  );
};

export default Scanner;
