import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, QrCode, Camera, ArrowLeft } from "lucide-react";

export default function ScannerPage() {
  const [, setLocation] = useLocation();
  const [scanning, setScanning] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [error, setError] = useState("");
  
  // This is a placeholder for actual QR code scanning functionality
  // In a real implementation, we would use a library like react-qr-reader
  const startScanning = () => {
    setScanning(true);
    setError("");
    
    // Simulating camera access and scanning
    setTimeout(() => {
      setScanning(false);
      // Here we would normally get the QR code from the scanner
      // For demo purposes, let's just redirect to a sample QR code page
      setLocation("/found/demo-qr-code");
    }, 3000);
  };
  
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCodeInput.trim()) {
      setError("Please enter a QR Code ID");
      return;
    }
    
    setError("");
    setLocation(`/found/${qrCodeInput}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" /> QR Code Scanner
            </CardTitle>
            <CardDescription>
              Scan a QR code to retrieve owner information
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              {scanning ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-64 h-64 mx-auto border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <div className="absolute inset-0 border-t-2 border-primary animate-[scanner_2s_ease-in-out_infinite]"></div>
                  </div>
                  <p className="text-sm text-gray-500">Scanning... Please point your camera at a QR code</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-64 h-64 mx-auto border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Camera className="h-16 w-16 text-gray-400" />
                  </div>
                  <Button onClick={startScanning} className="flex items-center">
                    <Camera className="mr-2 h-4 w-4" /> Start Camera
                  </Button>
                </div>
              )}
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>
            
            <form onSubmit={handleManualSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="qr-code" className="block text-sm font-medium text-gray-700">
                    Enter QR Code ID manually
                  </label>
                  <div className="mt-1">
                    <Input
                      id="qr-code"
                      value={qrCodeInput}
                      onChange={(e) => setQrCodeInput(e.target.value)}
                      placeholder="Enter QR Code ID"
                      className={error ? "border-red-500" : ""}
                    />
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Submit</Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-xs text-gray-500 text-center">
              QR-Track helps you find the owners of lost items. 
              Scan a QR code to see contact information and help return the item.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <style jsx>{`
        @keyframes scanner {
          0% { transform: translateY(0); }
          50% { transform: translateY(240px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
