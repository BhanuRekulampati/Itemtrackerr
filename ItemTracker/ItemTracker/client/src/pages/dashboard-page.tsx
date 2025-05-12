import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import TabNavigation from "@/components/tab-navigation";
import StatCard from "@/components/stat-card";
import QuickActionCard from "@/components/quick-action-card";
import ItemCard from "@/components/item-card";
import { Item } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });
  
  // Calculate stats
  const totalItems = items.length;
  const recentScans = items.filter(item => item.lastScan && 
    new Date(item.lastScan).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length;
  const activeItems = items.filter(item => item.isActive).length;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TabNavigation activeTab="dashboard" />
        
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.fullName.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-gray-500">Here's an overview of your items and recent activities.</p>
          
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard 
              icon="ri-qr-code-line" 
              iconColor="primary" 
              title="Total QR Codes" 
              value={totalItems.toString()} 
              linkText="Manage all items" 
              linkUrl="/items" 
            />
            
            <StatCard 
              icon="ri-scan-line" 
              iconColor="secondary" 
              title="Recent Scans" 
              value={`${recentScans} this week`} 
              linkText="View scan history" 
              linkUrl="/items" 
            />
            
            <StatCard 
              icon="ri-shield-check-line" 
              iconColor="accent" 
              title="Active Protection" 
              value={activeItems === totalItems ? "All items secured" : `${activeItems}/${totalItems} items secured`}
              linkText="Security settings" 
              linkUrl="/profile" 
            />
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickActionCard 
                icon="ri-add-line"
                iconColor="primary"
                title="Generate New QR Code"
                description="Create a new QR code for your item"
                link="/create"
              />
              
              <QuickActionCard 
                icon="ri-qr-scan-2-line"
                iconColor="secondary"
                title="Scan QR Code"
                description="Scan a QR code to retrieve information"
                link="/scan"
              />
              
              <QuickActionCard 
                icon="ri-edit-line"
                iconColor="accent"
                title="Update Contact Info"
                description="Edit your contact information"
                link="/profile"
              />
              
              <QuickActionCard 
                icon="ri-question-line"
                iconColor="gray"
                title="Get Support"
                description="Contact our support team"
                link="#"
              />
            </div>
          </div>
          
          {/* Recent Items */}
          <div className="mt-10">
            <h2 className="text-lg font-medium text-gray-900">Recent Items</h2>
            {items.length === 0 ? (
              <div className="mt-4 bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-500">You haven't added any items yet</p>
                <p className="mt-2">
                  <a href="/create" className="text-primary hover:text-primary/80 font-medium">
                    Create your first QR code
                  </a>
                </p>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.slice(0, 3).map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
