import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Cloud, 
  Leaf, 
  Mountain, 
  Play, 
  CloudRain, 
  Waves, 
  TreePine, 
  Flame,
  Zap
} from "lucide-react";
import ExerciseTimer from "./exercise-timer";

export default function RelaxationTab() {
  const [showTimer, setShowTimer] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState<any>(null);
  const [activeAmbient, setActiveAmbient] = useState<string | null>(null);

  const { data: meditations } = useQuery({
    queryKey: ['/api/meditations'],
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/stats/user'],
  });

  const startMeditation = (type: string) => {
    const meditationTypes = {
      breathing: {
        id: 'breathing-meditation',
        title: 'Respiration apaisante',
        description: 'Exercice de respiration pour calmer immédiatement l\'anxiété',
        duration: 5,
        instructions: 'Concentrez-vous uniquement sur votre respiration. Laissez vos pensées passer sans les juger.',
      },
      mindfulness: {
        id: 'mindfulness-meditation',
        title: 'Pleine conscience',
        description: 'Méditation pour observer ses pensées sans jugement',
        duration: 10,
        instructions: 'Observez vos pensées, émotions et sensations sans essayer de les changer. Soyez simplement présent.',
      },
      visualization: {
        id: 'visualization-meditation',
        title: 'Visualisation positive',
        description: 'Techniques de visualisation pour renforcer la motivation',
        duration: 15,
        instructions: 'Visualisez-vous dans un lieu de paix et de sérénité. Imaginez votre réussite et votre bien-être.',
      },
    };

    const meditation = meditationTypes[type as keyof typeof meditationTypes];
    if (meditation) {
      setSelectedMeditation(meditation);
      setShowTimer(true);
    }
  };

  const playAmbient = (soundType: string) => {
    setActiveAmbient(activeAmbient === soundType ? null : soundType);
    // In a real app, this would play/stop ambient sounds
  };

  const startQuickRelax = () => {
    setSelectedMeditation({
      id: 'quick-relax',
      title: 'Relaxation express',
      description: 'Technique rapide de relaxation en cas d\'urgence',
      duration: 2,
      instructions: 'Respirez profondément, relâchez vos épaules, détendez votre visage. Répétez: "Je suis calme et en contrôle."',
    });
    setShowTimer(true);
  };

  const weeklyProgress = userStats?.weeklyProgress?.meditation || 0;
  const weeklyGoal = 5;

  return (
    <div data-testid="relaxation-tab">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Relaxation & Méditation</h2>
        <p className="text-muted-foreground">Techniques de relaxation pour retrouver la sérénité</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Guided Meditations */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Méditations guidées</h3>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center">
                  <Cloud className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold" data-testid="meditation-breathing-title">
                    Respiration apaisante
                  </h4>
                  <p className="text-sm text-muted-foreground">5 minutes • Niveau débutant</p>
                </div>
                <Button
                  onClick={() => startMeditation('breathing')}
                  size="sm"
                  className="ml-auto bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="button-start-breathing-meditation"
                >
                  <Play size={16} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Exercice de respiration pour calmer immédiatement l'anxiété et les craving.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                  <Leaf className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold" data-testid="meditation-mindfulness-title">
                    Pleine conscience
                  </h4>
                  <p className="text-sm text-muted-foreground">10 minutes • Niveau intermédiaire</p>
                </div>
                <Button
                  onClick={() => startMeditation('mindfulness')}
                  size="sm"
                  className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-start-mindfulness-meditation"
                >
                  <Play size={16} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Méditation de pleine conscience pour observer ses pensées sans jugement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl flex items-center justify-center">
                  <Mountain className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold" data-testid="meditation-visualization-title">
                    Visualisation positive
                  </h4>
                  <p className="text-sm text-muted-foreground">15 minutes • Niveau avancé</p>
                </div>
                <Button
                  onClick={() => startMeditation('visualization')}
                  size="sm"
                  className="ml-auto bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  data-testid="button-start-visualization-meditation"
                >
                  <Play size={16} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Techniques de visualisation pour renforcer la motivation et la confiance.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ambient Sounds & Progress */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Sons d'ambiance</h3>
          
          <Card>
            <CardHeader>
              <CardTitle>Créez votre atmosphère</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => playAmbient('rain')}
                  className={`p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center ${
                    activeAmbient === 'rain' ? 'bg-muted' : ''
                  }`}
                  data-testid="button-ambient-rain"
                >
                  <CloudRain className="text-2xl text-primary mb-2 mx-auto" />
                  <div className="text-sm font-medium">Pluie</div>
                </button>
                <button
                  onClick={() => playAmbient('ocean')}
                  className={`p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center ${
                    activeAmbient === 'ocean' ? 'bg-muted' : ''
                  }`}
                  data-testid="button-ambient-ocean"
                >
                  <Waves className="text-2xl text-blue-500 mb-2 mx-auto" />
                  <div className="text-sm font-medium">Océan</div>
                </button>
                <button
                  onClick={() => playAmbient('forest')}
                  className={`p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center ${
                    activeAmbient === 'forest' ? 'bg-muted' : ''
                  }`}
                  data-testid="button-ambient-forest"
                >
                  <TreePine className="text-2xl text-green-500 mb-2 mx-auto" />
                  <div className="text-sm font-medium">Forêt</div>
                </button>
                <button
                  onClick={() => playAmbient('fire')}
                  className={`p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center ${
                    activeAmbient === 'fire' ? 'bg-muted' : ''
                  }`}
                  data-testid="button-ambient-fire"
                >
                  <Flame className="text-2xl text-orange-500 mb-2 mx-auto" />
                  <div className="text-sm font-medium">Feu</div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Relaxation */}
          <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
            <CardHeader>
              <CardTitle>Relaxation express</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Technique rapide en cas d'urgence
              </p>
              <Button
                onClick={startQuickRelax}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-quick-relax"
              >
                <Zap className="mr-2" size={16} />
                Commencer (2 min)
              </Button>
            </CardContent>
          </Card>

          {/* Progress Tracker */}
          <Card>
            <CardHeader>
              <CardTitle>Votre progression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sessions cette semaine</span>
                  <span className="font-medium" data-testid="text-weekly-sessions">
                    {weeklyProgress}/{weeklyGoal}
                  </span>
                </div>
                <Progress value={(weeklyProgress / weeklyGoal) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Temps total ce mois</span>
                  <span className="font-medium" data-testid="text-monthly-time">
                    {Math.floor((userStats?.totalSessions || 0) * 2.5)}min
                  </span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Meditation Timer */}
      {showTimer && selectedMeditation && (
        <ExerciseTimer
          exercise={selectedMeditation}
          isOpen={true}
          onClose={() => {
            setShowTimer(false);
            setSelectedMeditation(null);
          }}
        />
      )}
    </div>
  );
}
