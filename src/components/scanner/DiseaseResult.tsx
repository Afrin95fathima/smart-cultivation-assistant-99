
import { ArrowLeft, Share2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StatusBadge from "../ui/StatusBadge";
import { toast } from "sonner";

interface DiseaseResultProps {
  diseaseName?: string;
  severity?: "healthy" | "mild" | "severe";
  imageUrl?: string;
  symptoms?: string[];
  treatment?: string;
  confidence?: number;
}

const DiseaseResult = (props: DiseaseResultProps) => {
  // API URL - update this to your deployed backend URL
  const API_URL = "http://localhost:8000";
  
  const [result, setResult] = useState<DiseaseResultProps>({
    diseaseName: props.diseaseName || "Loading...",
    severity: props.severity || "mild",
    imageUrl: props.imageUrl || "https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
    symptoms: props.symptoms || [],
    treatment: props.treatment || "Loading treatment recommendations...",
    confidence: props.confidence || 0
  });

  useEffect(() => {
    const storedResult = sessionStorage.getItem('diseaseResult');
    
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        
        let severity: "healthy" | "mild" | "severe" = "mild";
        if (parsedResult.confidence > 85) {
          severity = "severe";
        } else if (parsedResult.confidence < 50) {
          severity = "healthy";
        }
        
        setResult({
          diseaseName: parsedResult.disease || "Unknown Disease",
          severity: severity,
          treatment: parsedResult.recommendations || "No specific treatment recommendations available.",
          confidence: parsedResult.confidence,
          symptoms: parsedResult.symptoms || [
            "Yellow to white lesions along the leaf veins",
            "Lesions turn yellow to white as they develop",
            "Wilting of leaves in severe cases",
          ],
          imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
        });
        
        sessionStorage.removeItem('diseaseResult');
      } catch (error) {
        console.error('Error parsing disease result:', error);
        toast.error("Could not load results correctly");
      }
    }
  }, []);

  const getIcon = () => {
    switch (result.severity) {
      case "healthy":
        return <CheckCircle size={22} className="text-status-healthy" />;
      case "mild":
        return <AlertTriangle size={22} className="text-status-mild" />;
      case "severe":
        return <AlertTriangle size={22} className="text-status-severe" />;
    }
  };

  const getFertilizerRecommendation = async () => {
    try {
      toast.info("Getting fertilizer recommendations...");
      
      const response = await fetch(`${API_URL}/recommend-fertilizer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disease: result.diseaseName }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const fertilizerResult = await response.json();
      
      sessionStorage.setItem('fertilizerResult', JSON.stringify(fertilizerResult));
      
      window.location.href = '/fertilizer';
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to get fertilizer recommendations. Please try again.");
      
      // Fallback to simulated data if the API call fails
      const simulatedFertilizerResult = {
        fertilizer: "Generic Fertilizer for " + result.diseaseName,
        guidelines: "Apply as directed based on plant size and severity of infection. Water thoroughly after application."
      };
      
      sessionStorage.setItem('fertilizerResult', JSON.stringify(simulatedFertilizerResult));
      window.location.href = '/fertilizer';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-farming-green text-white p-4 flex items-center justify-between">
        <Link to="/scanner" className="flex items-center">
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Back</span>
        </Link>
        <h1 className="text-lg font-bold">Analysis Result</h1>
        <button className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
          <Share2 size={16} />
        </button>
      </div>
      
      <div className="relative">
        <img 
          src={result.imageUrl} 
          alt={result.diseaseName} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <StatusBadge status={result.severity} className="mb-1" />
          <h2 className="text-white font-bold text-xl">{result.diseaseName}</h2>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex mb-4 bg-gray-50 rounded-lg p-3">
          {getIcon()}
          <div className="ml-3">
            <h3 className="font-semibold">Detection Confidence</h3>
            <p className="text-sm text-gray-600">
              {result.severity === "healthy" 
                ? "No disease detected. Your plant appears healthy." 
                : `The AI has detected ${result.severity === "severe" ? "significant" : "mild"} symptoms of ${result.diseaseName}.`
              }
              {result.confidence ? ` (${result.confidence.toFixed(1)}% confidence)` : ''}
            </p>
          </div>
        </div>
        
        {result.severity !== "healthy" && (
          <>
            <div className="mb-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <Info size={18} className="mr-2 text-farming-sky" />
                Symptoms
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                {result.symptoms?.map((symptom, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-farming-gold mt-1.5 mr-2"></span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <CheckCircle size={18} className="mr-2 text-farming-green" />
                Recommended Treatment
              </h3>
              <p className="text-sm text-gray-700">{result.treatment}</p>
            </div>
            
            <div className="mt-6">
              <button className="w-full bg-farming-green text-white py-3 rounded-lg font-medium shadow-md">
                Get Expert Advice
              </button>
              <button 
                onClick={getFertilizerRecommendation}
                className="w-full mt-3 border border-farming-green text-farming-green py-3 rounded-lg font-medium"
              >
                Get Fertilizer Recommendations
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DiseaseResult;
