import { Switch, Route } from "wouter";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import CreateQrCodePage from "@/pages/create-qr-code-page";
import ManageItemsPage from "@/pages/manage-items-page";
import ProfileSettingsPage from "@/pages/profile-settings-page";
import ScannerPage from "@/pages/scanner-page";
import ItemFoundPage from "@/pages/item-found-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/create" component={CreateQrCodePage} />
      <ProtectedRoute path="/items" component={ManageItemsPage} />
      <ProtectedRoute path="/profile" component={ProfileSettingsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/scan" component={ScannerPage} />
      <Route path="/found/:qrCodeId" component={ItemFoundPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
