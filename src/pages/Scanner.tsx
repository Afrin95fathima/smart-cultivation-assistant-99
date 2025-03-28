
import { useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import CameraOverlay from "@/components/scanner/CameraOverlay";
import { toast } from "sonner";

const Scanner = () => {
  useEffect(() => {
    // Prevent scrolling on this page
    document.body.style.overflow = "hidden";
    
    // Check if browser supports camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Camera not supported by your browser");
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
  }, []);

  return (
    <PageContainer showNav={false} className="h-screen overflow-hidden">
      <CameraOverlay />
    </PageContainer>
  );
};

export default Scanner;
