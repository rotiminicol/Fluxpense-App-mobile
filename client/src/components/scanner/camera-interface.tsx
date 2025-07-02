import { useState, useRef, useCallback } from "react";
import { Camera, X, Zap, Image, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateImageFile, processReceiptImage } from "../../lib/ocr";
import { useToast } from "@/hooks/use-toast";

interface CameraInterfaceProps {
  userId: number;
  onClose: () => void;
  onScanResult: (result: any) => void;
}

export function CameraInterface({ userId, onClose, onScanResult }: CameraInterfaceProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = useCallback(async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid Image",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setProgress(0);

    try {
      const result = await processReceiptImage(file, userId, {
        onProgress: setProgress,
        onError: (error) => {
          toast({
            title: "OCR Failed",
            description: error,
            variant: "destructive",
          });
        }
      });

      setIsScanning(false);
      onClose();
      setTimeout(() => onScanResult(result), 300);
    } catch (error) {
      setIsScanning(false);
      setProgress(0);
    }
  }, [userId, onClose, onScanResult, toast]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const handleGallerySelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative h-screen bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="w-full h-full bg-gray-900 opacity-60" />
      </div>
      
      {/* Scan Overlay */}
      <div className="scan-overlay">
        <div className="scan-frame">
          {/* Scanning Animation Line */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="scan-line animate-scan-line" />
          </div>
          
          {/* Corner Brackets */}
          <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-lg" />
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-12 left-0 right-0 px-6 flex items-center justify-between z-10">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClose}
          className="w-10 h-10 bg-black bg-opacity-50 rounded-full p-0 hover:bg-black hover:bg-opacity-70"
        >
          <X className="text-white" />
        </Button>
        <div className="bg-black bg-opacity-50 rounded-full px-4 py-2">
          <p className="text-white text-sm font-medium">Position receipt in frame</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-10 h-10 bg-black bg-opacity-50 rounded-full p-0 hover:bg-black hover:bg-opacity-70"
        >
          <Zap className="text-white" />
        </Button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-12 left-0 right-0 px-6">
        <div className="flex items-center justify-center space-x-8">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleGallerySelect}
            className="w-16 h-16 bg-white bg-opacity-20 rounded-full p-0 hover:bg-white hover:bg-opacity-30"
          >
            <Image className="text-white text-xl" />
          </Button>
          
          <Button
            onClick={handleCameraCapture}
            className="w-20 h-20 bg-white rounded-full p-0 shadow-lg hover:bg-gray-100"
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Camera className="text-white text-xl" />
            </div>
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="w-16 h-16 bg-white bg-opacity-20 rounded-full p-0 hover:bg-white hover:bg-opacity-30"
          >
            <Settings className="text-white text-xl" />
          </Button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-white text-sm opacity-80">Tap to capture receipt</p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Scanning Status */}
      {isScanning && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
          <Card className="w-full max-w-sm mx-4">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Processing Receipt</h3>
                <p className="text-gray-600 text-sm mb-4">Using AI to extract expense details...</p>
                <div className="bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-primary rounded-full h-1 transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
