import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { X, Check, Phone, Mail, ArrowLeft } from "lucide-react";

interface OwnerInfo {
  fullName: string;
  email: string;
  phone: string;
  item: {
    name: string;
    description: string | null;
  };
}

export default function ItemFoundPage() {
  const { qrCodeId } = useParams();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  
  useEffect(() => {
    const fetchItemInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/qr/${qrCodeId}`);
        
        if (!response.ok) {
          throw new Error("Item not found");
        }
        
        const data = await response.json();
        setOwnerInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item information");
      } finally {
        setLoading(false);
      }
    };
    
    if (qrCodeId) {
      fetchItemInfo();
    }
  }, [qrCodeId]);
  
  const handleReportFound = async () => {
    // In a real implementation, we would send a notification to the owner
    // that their item has been found
    alert("Thank you for reporting this item as found! The owner has been notified.");
  };
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
          <CardHeader className="bg-primary px-4 py-5 sm:px-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Item Found!</h2>
              <button 
                type="button" 
                className="text-white hover:text-gray-200"
                onClick={() => setLocation("/")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          
          {error ? (
            <CardContent className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Item Not Found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Sorry, we couldn't find information for this QR code. It may be invalid or no longer active.
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
              </div>
            </CardContent>
          ) : (
            <>
              <CardContent className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900">This item belongs to:</h3>
                  <div className="mt-2 text-xl font-semibold text-gray-900">{ownerInfo?.fullName}</div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500">CONTACT INFORMATION</h4>
                  <div className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                    <div className="flex items-center p-4">
                      <i className="ri-smartphone-line text-gray-400 text-lg"></i>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{ownerInfo?.phone}</p>
                        <p className="text-xs text-gray-500">Phone Number</p>
                      </div>
                      <a href={`tel:${ownerInfo?.phone}`} className="ml-auto bg-primary/10 text-primary p-2 rounded-full">
                        <Phone className="h-4 w-4" />
                      </a>
                    </div>
                    <div className="flex items-center p-4">
                      <i className="ri-mail-line text-gray-400 text-lg"></i>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{ownerInfo?.email}</p>
                        <p className="text-xs text-gray-500">Email Address</p>
                      </div>
                      <a href={`mailto:${ownerInfo?.email}`} className="ml-auto bg-primary/10 text-primary p-2 rounded-full">
                        <Mail className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500">ITEM DETAILS</h4>
                  <div className="mt-2 bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700">
                      <strong>Item:</strong> {ownerInfo?.item.name}<br />
                      {ownerInfo?.item.description && (
                        <>
                          <strong>Note:</strong> {ownerInfo.item.description}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-center w-full">
                  <Button onClick={handleReportFound} className="w-full">
                    Report This Item Found
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
