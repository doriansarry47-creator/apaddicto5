import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Wind, Activity, Phone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ExerciseTimer from "./exercise-timer";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const { toast } = useToast();
  const [showTimer, setShowTimer] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const emergencyMutation = useMutation({
    mutationFn: async (actionTaken: string) => {
      return await apiRequest('POST', '/api/emergency', {
        actionTaken,
        triggerReason: 'craving_emergency',
      });
    },
    onSuccess: () => {
      toast({
        title: "Urgence enregistrée",
        description: "Votre demande d'aide a été enregistrée.",
      });
    },
    onError: (error) => {
      console.error('Emergency event error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'urgence.",
        variant: "destructive",
      });
    },
  });

  const handleEmergencyBreathing = () => {
    emergencyMutation.mutate('breathing');
    setSelectedExercise({
      id: 'emergency-breathing',
      title: 'Respiration d\'urgence',
      description: 'Technique de respiration pour calmer immédiatement l\'anxiété',
      duration: 2,
      instructions: 'Inspirez lentement par le nez pendant 4 secondes, retenez pendant 4 secondes, puis expirez par la bouche pendant 6 secondes.',
    });
    setShowTimer(true);
    onClose();
  };

  const handleEmergencyExercise = () => {
    emergencyMutation.mutate('exercise');
    setSelectedExercise({
      id: 'emergency-cardio',
      title: 'Exercice intensif d\'urgence',
      description: 'Exercice physique pour libérer les endorphines',
      duration: 5,
      instructions: 'Alternez entre jumping jacks, squats et montées de genoux. 30 secondes d\'effort, 10 secondes de repos.',
    });
    setShowTimer(true);
    onClose();
  };

  const handleCallSupport = () => {
    emergencyMutation.mutate('support_call');
    toast({
      title: "Appel d'urgence",
      description: "Vous allez être redirigé vers l'aide d'urgence.",
    });
    // In a real app, this would initiate a call or chat with support
    window.open('tel:0800235236', '_self');
  };

  if (showTimer && selectedExercise) {
    return (
      <ExerciseTimer
        exercise={selectedExercise}
        isOpen={true}
        onClose={() => {
          setShowTimer(false);
          setSelectedExercise(null);
        }}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-6" data-testid="emergency-modal">
        <DialogHeader className="text-center mb-6">
          <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-destructive-foreground text-2xl" />
          </div>
          <DialogTitle className="text-2xl font-bold text-destructive">
            Programme d'urgence
          </DialogTitle>
          <p className="text-muted-foreground mt-2">Nous sommes là pour vous aider</p>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            onClick={handleEmergencyBreathing}
            disabled={emergencyMutation.isPending}
            className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            data-testid="button-emergency-breathing"
          >
            <Wind className="mr-3" size={20} />
            Respiration d'urgence (2 min)
          </Button>
          
          <Button
            onClick={handleEmergencyExercise}
            disabled={emergencyMutation.isPending}
            className="w-full bg-secondary text-secondary-foreground py-4 px-6 rounded-xl font-medium hover:bg-secondary/90 transition-colors"
            data-testid="button-emergency-exercise"
          >
            <Activity className="mr-3" size={20} />
            Exercice intensif (5 min)
          </Button>
          
          <Button
            onClick={handleCallSupport}
            disabled={emergencyMutation.isPending}
            className="w-full bg-accent text-accent-foreground py-4 px-6 rounded-xl font-medium hover:bg-accent/90 transition-colors"
            data-testid="button-call-support"
          >
            <Phone className="mr-3" size={20} />
            Contacter l'aide d'urgence
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center mb-4" data-testid="text-emergency-numbers">
            Numéros d'urgence
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="font-medium">Ligne d'écoute: 0800 235 236</span>
          </div>
        </div>

        <Button
          onClick={onClose}
          variant="ghost"
          className="w-full mt-6 bg-muted text-muted-foreground py-3 rounded-lg hover:bg-muted/80 transition-colors"
          data-testid="button-close-emergency"
        >
          Fermer
        </Button>
      </DialogContent>
    </Dialog>
  );
}
