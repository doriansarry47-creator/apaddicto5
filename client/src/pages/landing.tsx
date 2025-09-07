import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4" data-testid="landing-page">
      <div className="w-full max-w-md">
        <Card className="p-8 space-y-6 shadow-xl">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4" data-testid="app-logo">
              <Heart className="text-2xl text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="app-title">Apaddicto</h1>
            <p className="text-muted-foreground mt-2" data-testid="app-subtitle">Votre allié contre les craving</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-center text-muted-foreground" data-testid="welcome-message">
              Gérez vos craving par l'activité physique, la relaxation et la psychoéducation.
            </p>
            
            <Button 
              onClick={handleLogin}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              data-testid="button-login"
            >
              Se connecter
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground" data-testid="help-text">
              Besoin d'aide ? Contactez votre thérapeute.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
