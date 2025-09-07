import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import OverviewTab from "@/components/overview-tab";
import ExercisesTab from "@/components/exercises-tab";
import RelaxationTab from "@/components/relaxation-tab";
import EducationTab from "@/components/education-tab";
import GoalsTab from "@/components/goals-tab";
import EmergencyModal from "@/components/emergency-modal";

type TabType = 'overview' | 'exercises' | 'relaxation' | 'education' | 'goals';

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const tabs = [
    { id: 'overview', label: 'Accueil', icon: 'fas fa-home' },
    { id: 'exercises', label: 'Exercices', icon: 'fas fa-dumbbell' },
    { id: 'relaxation', label: 'Relaxation', icon: 'fas fa-leaf' },
    { id: 'education', label: 'Psychoéducation', icon: 'fas fa-brain' },
    { id: 'goals', label: 'Objectifs', icon: 'fas fa-trophy' },
  ] as const;

  return (
    <div className="min-h-screen" data-testid="patient-dashboard">
      {/* Emergency Button (Fixed) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowEmergencyModal(true)}
          className="bg-destructive text-destructive-foreground w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition-transform animate-pulse flex items-center justify-center"
          data-testid="button-emergency"
        >
          <i className="fas fa-exclamation text-xl"></i>
        </Button>
      </div>

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3" data-testid="header-brand">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="text-primary-foreground" size={20} />
              </div>
              <h1 className="text-xl font-bold text-foreground">Apaddicto</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground" data-testid="text-username">
                Bonjour, {user?.firstName || 'Patient'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-logout"
              >
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-card border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'exercises' && <ExercisesTab />}
        {activeTab === 'relaxation' && <RelaxationTab />}
        {activeTab === 'education' && <EducationTab />}
        {activeTab === 'goals' && <GoalsTab />}
      </main>

      {/* Emergency Modal */}
      <EmergencyModal 
        isOpen={showEmergencyModal} 
        onClose={() => setShowEmergencyModal(false)} 
      />
    </div>
  );
}
