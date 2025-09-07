import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardTab from "@/components/admin/dashboard-tab";
import PatientsTab from "@/components/admin/patients-tab";
import ContentTab from "@/components/admin/content-tab";

type AdminTabType = 'dashboard' | 'patients' | 'content';

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTabType>('dashboard');

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-chart-bar' },
    { id: 'patients', label: 'Patients', icon: 'fas fa-users' },
    { id: 'content', label: 'Contenu', icon: 'fas fa-edit' },
  ] as const;

  return (
    <div className="min-h-screen" data-testid="admin-panel">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3" data-testid="admin-header-brand">
              <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center">
                <Shield className="text-destructive-foreground" size={20} />
              </div>
              <h1 className="text-xl font-bold text-foreground">Apaddicto Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground" data-testid="text-admin-name">
                Admin: {user?.firstName || 'Administrateur'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-admin-logout"
              >
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-destructive text-destructive'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`admin-tab-${tab.id}`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'patients' && <PatientsTab />}
        {activeTab === 'content' && <ContentTab />}
      </main>
    </div>
  );
}
