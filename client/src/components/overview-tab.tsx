import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Wind, 
  Play, 
  Target, 
  TrendingUp, 
  Leaf,
  Brain,
  Trophy,
  Medal,
  Users,
  Star,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import EmergencyModal from "./emergency-modal";
import ExerciseTimer from "./exercise-timer";

export default function OverviewTab() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const { data: userStats } = useQuery({
    queryKey: ['/api/stats/user'],
  });

  const { data: recentSessions } = useQuery({
    queryKey: ['/api/sessions'],
  });

  const startQuickExercise = () => {
    setSelectedExercise({
      id: 'quick-breathing',
      title: 'Respiration rapide',
      description: 'Exercice de respiration pour se recentrer',
      duration: 3,
      instructions: 'Concentrez-vous sur votre respiration. Inspirez profondément, retenez, puis expirez lentement.',
    });
    setShowTimer(true);
  };

  const startBreathing = () => {
    setSelectedExercise({
      id: 'guided-breathing',
      title: 'Respiration guidée',
      description: 'Technique de respiration avancée',
      duration: 5,
      instructions: 'Suivez le rythme guidé: 4 secondes d\'inspiration, 4 secondes de rétention, 6 secondes d\'expiration.',
    });
    setShowTimer(true);
  };

  return (
    <div data-testid="overview-tab">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Welcome Card */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2" data-testid="text-welcome">
                Bon retour !
              </h2>
              <p className="opacity-90">
                Vous avez complété {userStats?.totalSessions || 0} sessions au total. Continuez comme ça !
              </p>
              <div className="mt-4 flex space-x-4">
                <div className="bg-white/20 rounded-lg px-3 py-2">
                  <div className="text-sm opacity-75">Jours sans craving</div>
                  <div className="text-2xl font-bold" data-testid="text-clean-days">
                    {userStats?.cleanDayStreak || 0}
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg px-3 py-2">
                  <div className="text-sm opacity-75">Sessions complétées</div>
                  <div className="text-2xl font-bold" data-testid="text-completed-sessions">
                    {userStats?.totalSessions || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setShowEmergencyModal(true)}
                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-quick-emergency"
              >
                <AlertTriangle className="mr-2" size={16} />
                Urgence Craving
              </Button>
              <Button
                onClick={startQuickExercise}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                data-testid="button-quick-exercise"
              >
                <Play className="mr-2" size={16} />
                Exercice rapide
              </Button>
              <Button
                onClick={startBreathing}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-quick-breathing"
              >
                <Wind className="mr-2" size={16} />
                Respiration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Progression hebdomadaire</h4>
              <TrendingUp className="text-primary" size={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exercices</span>
                <span className="font-medium" data-testid="text-exercises-progress">
                  {userStats?.weeklyProgress?.exercises || 0}/20
                </span>
              </div>
              <Progress 
                value={((userStats?.weeklyProgress?.exercises || 0) / 20) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Méditation</h4>
              <Leaf className="text-accent" size={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sessions</span>
                <span className="font-medium" data-testid="text-meditation-progress">
                  {userStats?.weeklyProgress?.meditation || 0}/10
                </span>
              </div>
              <Progress 
                value={((userStats?.weeklyProgress?.meditation || 0) / 10) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Psychoéducation</h4>
              <Brain className="text-secondary" size={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Modules</span>
                <span className="font-medium" data-testid="text-education-progress">
                  {userStats?.weeklyProgress?.education || 0}/5
                </span>
              </div>
              <Progress 
                value={((userStats?.weeklyProgress?.education || 0) / 5) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Niveau actuel</h4>
              <Trophy className="text-yellow-500" size={20} />
            </div>
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="text-user-level">
                  Niveau {userStats?.level || 1}
                </div>
                <div className="text-sm text-muted-foreground" data-testid="text-user-points">
                  {userStats?.points || 0} points
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-6">Activité récente</h3>
        <Card>
          <CardContent className="p-0">
            {recentSessions && recentSessions.length > 0 ? (
              <div className="divide-y">
                {recentSessions.slice(0, 5).map((session: any, index: number) => (
                  <div key={session.id} className="p-4 flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {session.contentType === 'exercise' && <Activity className="text-primary" size={20} />}
                      {session.contentType === 'meditation' && <Leaf className="text-accent" size={20} />}
                      {session.contentType === 'education' && <Brain className="text-secondary" size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" data-testid={`activity-title-${index}`}>
                        Session {session.contentType === 'exercise' ? 'd\'exercice' : 
                                session.contentType === 'meditation' ? 'de méditation' : 
                                'de psychoéducation'}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`activity-time-${index}`}>
                        {new Date(session.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-secondary" data-testid={`activity-points-${index}`}>
                      +{session.pointsEarned || 0} pts
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Activity className="mx-auto mb-4" size={48} />
                <p>Aucune activité récente</p>
                <p className="text-sm">Commencez votre première session !</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <EmergencyModal 
        isOpen={showEmergencyModal} 
        onClose={() => setShowEmergencyModal(false)} 
      />

      {showTimer && selectedExercise && (
        <ExerciseTimer
          exercise={selectedExercise}
          isOpen={true}
          onClose={() => {
            setShowTimer(false);
            setSelectedExercise(null);
          }}
        />
      )}
    </div>
  );
}
