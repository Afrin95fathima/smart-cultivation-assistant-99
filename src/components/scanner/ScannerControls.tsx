
import { Link } from "react-router-dom";
import { X, Image } from "lucide-react";

type TopControlsProps = {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TopControls = ({ onFileSelect }: TopControlsProps) => {
  return (
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
          onChange={onFileSelect}
        />
      </label>
    </div>
  );
};

type BottomControlProps = {
  onCapture: () => void;
  cameraActive: boolean;
  isScanning: boolean;
};

export const BottomControl = ({ onCapture, cameraActive, isScanning }: BottomControlProps) => {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
      <button 
        onClick={onCapture}
        disabled={isScanning}
        className={`h-16 w-16 rounded-full bg-gradient-to-tr from-farming-green to-farming-green-light flex items-center justify-center shadow-lg glow-effect ${isScanning ? 'opacity-70' : ''}`}
      >
        <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
          <div className={`h-10 w-10 rounded-full bg-white/20 ${isScanning ? 'animate-pulse-fast' : 'animate-pulse-gentle'}`}></div>
        </div>
      </button>
    </div>
  );
};
