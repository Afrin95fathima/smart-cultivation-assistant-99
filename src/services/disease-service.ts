
import { toast } from "sonner";

// API URL - update this to your deployed backend URL
const API_URL = "http://localhost:8000";

export type DiseaseResult = {
  disease: string;
  confidence: number;
  recommendations: string;
  description: string;
  symptoms: string[];
};

export const predictDisease = async (imageFile: File): Promise<DiseaseResult | null> => {
  try {
    // Create a FormData object to send the image to the backend
    const formData = new FormData();
    formData.append('file', imageFile);
    
    // Make the API call to the disease prediction endpoint
    const response = await fetch(`${API_URL}/predict-disease`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Process the response
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    toast.error("Failed to process image. Using simulated data instead.");
    return null;
  }
};

export const simulateDiseaseResult = (): DiseaseResult => {
  // Sample response that mimics the API response format
  return {
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
};
