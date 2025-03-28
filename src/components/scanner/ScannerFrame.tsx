
import { Mic } from "lucide-react";

type ScannerFrameProps = {
  selectedImage: File | null;
  cameraActive: boolean;
  isScanning: boolean;
};

const ScannerFrame = ({ selectedImage, cameraActive, isScanning }: ScannerFrameProps) => {
  return (
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
  );
};

export default ScannerFrame;
