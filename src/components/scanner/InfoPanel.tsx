
import { Info } from "lucide-react";

type InfoPanelProps = {
  selectedImage: File | null;
  cameraActive: boolean;
  permissionDenied: boolean;
};

const InfoPanel = ({ selectedImage, cameraActive, permissionDenied }: InfoPanelProps) => {
  return (
    <div className="bg-black/50 backdrop-blur-sm p-4">
      <div className="flex items-start mb-2">
        <Info size={16} className="text-farming-gold mt-0.5 mr-2" />
        <p className="text-white text-sm flex-1">
          {selectedImage 
            ? "Tap the button below to analyze the selected image" 
            : cameraActive 
              ? "Hold your camera steady over the affected plant part and tap to capture" 
              : permissionDenied
                ? "Camera access was denied. Use gallery option or check browser settings."
                : "Tap the button below to start camera"
          }
        </p>
      </div>
    </div>
  );
};

export default InfoPanel;
