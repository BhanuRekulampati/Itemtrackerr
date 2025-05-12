import { formatDistanceToNow } from "date-fns";
import { Item } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Edit, Trash2 } from "lucide-react";

interface ItemCardProps {
  item: Item;
  onDelete?: () => void;
}

export default function ItemCard({ item, onDelete }: ItemCardProps) {
  const downloadQRCode = () => {
    const canvas = document.getElementById(`qr-canvas-${item.id}`) as HTMLCanvasElement;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `qrcode-${item.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const getLastScanText = () => {
    if (!item.lastScan) return "Never";
    return formatDistanceToNow(new Date(item.lastScan), { addSuffix: true });
  };
  
  return (
    <Card className="shadow rounded-lg overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-primary/10 text-primary">
                <i className={`${item.icon || 'ri-smartphone-line'} text-xl`}></i>
              </span>
            </div>
            <div className="ml-3">
              <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">
                Added on {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown date'}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              item.isActive 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {item.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <div className="p-1 bg-white rounded-lg">
            <QRCodeCanvas
              id={`qr-canvas-${item.id}`}
              value={`${window.location.origin}/found/${item.qrCodeId}`}
              size={112}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Scans:</span>
            <span className="font-medium">{item.scanCount || 0} times</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Last scan:</span>
            <span className="font-medium">{getLastScanText()}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-200 bg-gray-50 px-4 py-4">
        <div className="flex justify-between w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary/80 focus:outline-none"
            onClick={downloadQRCode}
          >
            <Download className="mr-1 h-4 w-4" /> Download
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:text-gray-500 focus:outline-none"
              asChild
            >
              <a href={`/items/${item.id}/edit`}>
                <Edit className="mr-1 h-4 w-4" /> Edit
              </a>
            </Button>
            
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-red-500 focus:outline-none"
                onClick={onDelete}
              >
                <Trash2 className="mr-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
