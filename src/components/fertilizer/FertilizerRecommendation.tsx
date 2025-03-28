
import { Card } from "@/components/ui/card";
import { Info, Droplet, ExternalLink, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface FertilizerRecommendationProps {
  diseaseName: string;
}

const FertilizerRecommendation = ({ diseaseName }: FertilizerRecommendationProps) => {
  // Default fertilizer data
  const [fertilizerData, setFertilizerData] = useState({
    name: "Loading...",
    usage: "Loading application details...",
    effectiveness: 80,
    organic: false,
    amazonLink: "#"
  });
  
  // Static disease info for fallback
  const diseaseInfo = {
    "Bacterial Leaf Blight": {
      description: "Bacterial Leaf Blight is a serious rice disease caused by Xanthomonas oryzae that leads to wilting and yellowing of leaves.",
      severity: "moderate",
      fertilizer: {
        name: "Copper Oxychloride",
        usage: "Apply 2.5g/liter of water as a foliar spray",
        effectiveness: 85,
        organic: false,
        amazonLink: "https://www.amazon.com/Southern-Ag-Liquid-Copper-Fungicide/dp/B000H7N66W/"
      }
    },
    "Blast": {
      description: "Rice blast is a fungal disease that affects the leaves, stems, and panicles with diamond-shaped lesions.",
      severity: "severe",
      fertilizer: {
        name: "Tricyclazole",
        usage: "Apply 6ml/10 liters of water",
        effectiveness: 90,
        organic: false,
        amazonLink: "https://www.amazon.com/Fungicide-Tricyclazole-Blast-Control-Agriculture/dp/B08VHWNXR8/"
      }
    },
    "Brown Spot": {
      description: "Brown spot is a fungal disease causing oval brown lesions on leaves. Often related to nutrient deficiency.",
      severity: "mild",
      fertilizer: {
        name: "Mancozeb",
        usage: "Apply 2.5g/liter as preventive spray",
        effectiveness: 80,
        organic: false,
        amazonLink: "https://www.amazon.com/Southern-Ag-Dithane-Mancozeb-Fungicide/dp/B000COT8J0/"
      }
    },
    "Leaf Scald": {
      description: "Leaf scald appears as long, yellow-orange lesions with brownish margins, usually on older leaves.",
      severity: "moderate",
      fertilizer: {
        name: "Propiconazole",
        usage: "Apply 1ml/liter of water",
        effectiveness: 85,
        organic: false,
        amazonLink: "https://www.amazon.com/Propiconazole-Fungicide-Heritage-Fungicide-Alternative/dp/B095KKHMSR/"
      }
    },
    "Sheath Blight": {
      description: "Sheath blight appears as oval lesions on leaf sheaths with gray-white centers and brown margins.",
      severity: "severe",
      fertilizer: {
        name: "Hexaconazole",
        usage: "Apply 2ml/liter of water",
        effectiveness: 90,
        organic: false,
        amazonLink: "https://www.amazon.com/Hexaconazole-5-Systemic-Fungicide-100/dp/B08M5GVHFR/"
      }
    }
  };

  useEffect(() => {
    // Try to retrieve fertilizer data from session storage (set in DiseaseResult.tsx)
    const storedFertilizerData = sessionStorage.getItem('fertilizerResult');
    
    if (storedFertilizerData) {
      try {
        const parsedFertilizerData = JSON.parse(storedFertilizerData);
        
        setFertilizerData({
          name: parsedFertilizerData.fertilizer || "Unknown Fertilizer",
          usage: parsedFertilizerData.guidelines || "No specific guidelines available",
          effectiveness: 85, // Default effectiveness
          organic: parsedFertilizerData.fertilizer?.toLowerCase().includes("organic") || false,
          amazonLink: "#"    // Default link
        });
        
        // Clear session storage
        sessionStorage.removeItem('fertilizerResult');
      } catch (error) {
        console.error('Error parsing fertilizer data:', error);
        toast.error("Could not load fertilizer data");
        
        // Fallback to static data
        const currentDisease = diseaseInfo[diseaseName as keyof typeof diseaseInfo] || diseaseInfo["Bacterial Leaf Blight"];
        setFertilizerData(currentDisease.fertilizer);
      }
    } else {
      // No data from API, use the static data
      const currentDisease = diseaseInfo[diseaseName as keyof typeof diseaseInfo] || diseaseInfo["Bacterial Leaf Blight"];
      setFertilizerData(currentDisease.fertilizer);
    }
  }, [diseaseName]);

  const currentDisease = diseaseInfo[diseaseName as keyof typeof diseaseInfo] || diseaseInfo["Bacterial Leaf Blight"];
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "text-yellow-500";
      case "moderate": return "text-orange-500";
      case "severe": return "text-red-500";
      default: return "text-yellow-500";
    }
  };

  const getEffectivenessClass = (effectiveness: number) => {
    if (effectiveness >= 85) return "bg-green-500";
    if (effectiveness >= 70) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const handleBuyNow = () => {
    // For organic fertilizers, we'll use a different Amazon link
    const amazonLink = fertilizerData.organic 
      ? "https://www.amazon.com/s?k=organic+fertilizer" 
      : fertilizerData.amazonLink;
      
    window.open(amazonLink, '_blank');
    toast.success("Opening Amazon product page");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="mb-4">
        <div className="flex items-start">
          <AlertTriangle className={`mr-2 mt-1 ${getSeverityColor(currentDisease.severity)}`} size={20} />
          <div>
            <h3 className="font-bold text-lg mb-1">{diseaseName}</h3>
            <p className="text-sm text-gray-600">{currentDisease.description}</p>
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-farming-green/5 rounded-lg border border-farming-green/10">
          <h4 className="font-medium text-farming-green flex items-center">
            <Info size={16} className="mr-2" />
            Recommended Solution
          </h4>
        </div>
      </div>
      
      <Card className="p-4 border border-gray-100 mb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div className={`h-12 w-12 rounded-full ${fertilizerData.organic ? 'bg-farming-green/10' : 'bg-farming-sky/10'} flex items-center justify-center mr-3`}>
              <Droplet size={24} className={fertilizerData.organic ? 'text-farming-green' : 'text-farming-sky'} />
            </div>
            <div>
              <div className="flex items-center">
                <h4 className="font-semibold text-lg">{fertilizerData.name}</h4>
                {fertilizerData.organic && (
                  <span className="ml-2 text-xs bg-farming-green/10 text-farming-green px-2 py-0.5 rounded-full">
                    Organic
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-1">{fertilizerData.usage}</p>
              
              <div className="mt-3 flex items-center">
                <div className="text-xs mr-2">Effectiveness:</div>
                <div className="w-28 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getEffectivenessClass(fertilizerData.effectiveness)}`}
                    style={{width: `${fertilizerData.effectiveness}%`}}
                  ></div>
                </div>
                <div className="text-xs ml-2 font-medium">{fertilizerData.effectiveness}%</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <button 
        onClick={handleBuyNow}
        className="w-full bg-farming-gold text-white py-3 rounded-lg font-medium shadow-md flex items-center justify-center transition-all hover:bg-farming-gold-dark"
      >
        Buy on Amazon
        <ExternalLink size={16} className="ml-2" />
      </button>

      <div className="mt-4 bg-farming-gold/10 rounded-lg p-3">
        <p className="text-sm font-medium text-farming-gold-dark flex items-center">
          <Info size={16} className="mr-2" />
          Always follow proper safety guidelines when applying fertilizers
        </p>
      </div>
    </div>
  );
};

export default FertilizerRecommendation;
