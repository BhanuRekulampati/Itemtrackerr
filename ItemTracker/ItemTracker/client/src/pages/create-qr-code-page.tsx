import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertItemSchema, InsertItem } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Redirect } from "wouter";
import Navbar from "@/components/navbar";
import TabNavigation from "@/components/tab-navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Loader2, QrCode, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRCodeCanvas } from "qrcode.react";
import { Card } from "@/components/ui/card";

// Icons for item types
const itemIcons = [
  { value: "ri-smartphone-line", label: "Smartphone" },
  { value: "ri-laptop-line", label: "Laptop" },
  { value: "ri-briefcase-line", label: "Bag" },
  { value: "ri-key-line", label: "Keys" },
  { value: "ri-wallet-line", label: "Wallet" },
  { value: "ri-headphone-line", label: "Headphones" },
  { value: "ri-camera-line", label: "Camera" },
  { value: "ri-bike-line", label: "Bicycle" },
];

export default function CreateQrCodePage() {
  const { toast } = useToast();
  const [createdItem, setCreatedItem] = useState<any>(null);
  
  const form = useForm<InsertItem>({
    resolver: zodResolver(insertItemSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "ri-smartphone-line",
    },
  });
  
  const createItemMutation = useMutation({
    mutationFn: async (data: InsertItem) => {
      const res = await apiRequest("POST", "/api/items", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      setCreatedItem(data);
      toast({
        title: "QR Code created!",
        description: "Your QR code has been successfully generated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create QR code",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: InsertItem) => {
    createItemMutation.mutate(data);
  };
  
  const resetForm = () => {
    setCreatedItem(null);
    form.reset();
  };
  
  const downloadQRCode = () => {
    if (!createdItem) return;
    
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `qrcode-${createdItem.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TabNavigation activeTab="create" />
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md mt-6">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Generate a new QR code</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Create a QR code to attach to your personal items.</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {createdItem ? (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your QR Code is Ready!</h3>
                  <p className="text-sm text-gray-500 mb-6">Print this QR code and attach it to your {createdItem.name}</p>
                  
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <QRCodeCanvas
                      id="qr-canvas"
                      value={`${window.location.origin}/found/${createdItem.qrCodeId}`}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <p className="text-sm font-medium text-gray-900">Item: {createdItem.name}</p>
                    {createdItem.description && (
                      <p className="text-sm text-gray-500">Description: {createdItem.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="flex items-center"
                  >
                    <QrCode className="mr-2 h-4 w-4" /> Create Another
                  </Button>
                  
                  <Button
                    onClick={downloadQRCode}
                    className="flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download QR Code
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Laptop, Keys, Wallet"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional details about your item"
                            value={field.value || ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue="ri-smartphone-line"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select item type" />
                            </SelectTrigger>
                            <SelectContent>
                              {itemIcons.map((icon) => (
                                <SelectItem key={icon.value} value={icon.value}>
                                  <div className="flex items-center">
                                    <i className={`${icon.value} mr-2`}></i>
                                    <span>{icon.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel className="block text-sm font-medium text-gray-700">QR Code Style</FormLabel>
                    <div className="mt-1">
                      <RadioGroup defaultValue="standard" className="grid grid-cols-3 gap-3 mt-1">
                        <div className="relative">
                          <RadioGroupItem value="standard" id="style-1" className="sr-only peer" />
                          <FormLabel htmlFor="style-1" className="cursor-pointer block p-3 bg-white border border-gray-300 rounded-md shadow-sm text-center peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary">
                            <span className="block text-sm font-medium text-gray-900">Standard</span>
                          </FormLabel>
                        </div>
                        
                        <div className="relative">
                          <RadioGroupItem value="rounded" id="style-2" className="sr-only peer" />
                          <FormLabel htmlFor="style-2" className="cursor-pointer block p-3 bg-white border border-gray-300 rounded-md shadow-sm text-center peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary">
                            <span className="block text-sm font-medium text-gray-900">Rounded</span>
                          </FormLabel>
                        </div>
                        
                        <div className="relative">
                          <RadioGroupItem value="branded" id="style-3" className="sr-only peer" />
                          <FormLabel htmlFor="style-3" className="cursor-pointer block p-3 bg-white border border-gray-300 rounded-md shadow-sm text-center peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary">
                            <span className="block text-sm font-medium text-gray-900">Branded</span>
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={createItemMutation.isPending}
                    className="flex items-center"
                  >
                    {createItemMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <QrCode className="mr-2 h-4 w-4" /> Generate QR Code
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
