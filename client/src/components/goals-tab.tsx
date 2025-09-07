import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Trophy, 
  Medal, 
  Crown,
  Gift,
  CheckCircle,
  Star,
  Flame,
  Dumbbell,
  Brain,
  Users,
  TrendingUp,
  Lock
} from "lucide-react";

export default function GoalsTab() {
  const { data: goals } = useQuery({
    queryKey: ['/api/goals'],
  });

  const { data: goalProgress } = useQuery({
    queryKey: ['/api/goal-progress'],
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/stats/user'],
  });

  const getProgressForGoal = (goalId: string) => {
    const progress = goalProgress?.find((p: any) => p.goalId === goalId);
    return progress?.currentProgress || 0;
  };

  const isGoalCompleted = (goalId: string) => {
    const progress = goalProgress?.find((p: any) => p.goalId === goalId);
    return progress?.completed || false;
  };

  const currentLevel = userStats?.level || 1;
  const currentPoints = userStats?.points || 0;
  const nextLevelPoints = currentLevel * 125; // Points needed for next level
  const progressToNextLevel = (currentPoints / nextLevelPoints) * 100;

  return (
    <div data-testid="goals-tab">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Objectifs & Récompenses</h2>
        <p className="text-muted-foreground">Atteignez vos objectifs et débloquez des récompenses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Goals */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Objectifs actifs</h3>
            <div className="space-y-4">
              {/* Mock active goals based on common addiction recovery milestones */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold" data-testid="goal-clean-days-title">
                          7 jours sans craving
                        </h4>
                        <Badge className="bg-primary/10 text-primary" data-testid="goal-clean-days-status">
                          En cours
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Maintenez votre abstinence pendant une semaine complète
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span className="font-medium" data-testid="goal-clean-days-progress">
                            {Math.min(userStats?.cleanDayStreak || 0, 7)}/7 jours
                          </span>
                        </div>
                        <Progress 
                          value={(Math.min(userStats?.cleanDayStreak || 0, 7) / 7) * 100} 
                          className="h-3"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <Gift className="mr-1 inline" size={14} />
                          Récompense: Badge "Persévérant" + 100 points
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                      <Dumbbell className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold" data-testid="goal-exercises-title">
                          20 exercices cette semaine
                        </h4>
                        <Badge className="bg-secondary/10 text-secondary" data-testid="goal-exercises-status">
                          En cours
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Completez 20 sessions d'exercices physiques
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span className="font-medium" data-testid="goal-exercises-progress">
                            {Math.min(userStats?.weeklyProgress?.exercises || 0, 20)}/20 exercices
                          </span>
                        </div>
                        <Progress 
                          value={(Math.min(userStats?.weeklyProgress?.exercises || 0, 20) / 20) * 100} 
                          className="h-3"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <Gift className="mr-1 inline" size={14} />
                          Récompense: Badge "Athlète" + 75 points
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-destructive rounded-xl flex items-center justify-center flex-shrink-0">
                      <Brain className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold" data-testid="goal-education-title">
                          Terminer 3 modules éducatifs
                        </h4>
                        <Badge className="bg-accent/10 text-accent" data-testid="goal-education-status">
                          En cours
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Completez 3 modules de psychoéducation
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span className="font-medium" data-testid="goal-education-progress">
                            {Math.min(userStats?.weeklyProgress?.education || 0, 3)}/3 modules
                          </span>
                        </div>
                        <Progress 
                          value={(Math.min(userStats?.weeklyProgress?.education || 0, 3) / 3) * 100} 
                          className="h-3"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <Gift className="mr-1 inline" size={14} />
                          Récompense: Badge "Érudit" + 150 points
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Render actual goals from API if available */}
              {goals && goals.map((goal: any) => (
                <Card key={goal.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Target className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold" data-testid={`goal-title-${goal.id}`}>
                            {goal.title}
                          </h4>
                          <Badge className={isGoalCompleted(goal.id) ? "bg-green-100 text-green-800" : "bg-primary/10 text-primary"}>
                            {isGoalCompleted(goal.id) ? "Terminé" : "En cours"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4" data-testid={`goal-description-${goal.id}`}>
                          {goal.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progression</span>
                            <span className="font-medium" data-testid={`goal-progress-${goal.id}`}>
                              {getProgressForGoal(goal.id)}/{goal.target}
                            </span>
                          </div>
                          <Progress 
                            value={(getProgressForGoal(goal.id) / goal.target) * 100} 
                            className="h-3"
                          />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            <Gift className="mr-1 inline" size={14} />
                            Récompense: {goal.pointsReward} points
                          </div>
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>

          {/* Completed Goals */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Objectifs accomplis</h3>
            <div className="space-y-4">
              {userStats?.totalSessions > 0 && (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-green-800" data-testid="completed-goal-title">
                            Premier exercice complété
                          </h4>
                          <Badge className="bg-green-100 text-green-700">Terminé</Badge>
                        </div>
                        <p className="text-sm text-green-700/70 mb-2">
                          Félicitations ! Vous avez fait votre premier pas.
                        </p>
                        <div className="text-sm text-green-600 font-medium">
                          <Trophy className="mr-1 inline" size={14} />
                          Badge "Premier pas" obtenu + 25 points
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Show message if no completed goals */}
              {(!userStats?.totalSessions || userStats.totalSessions === 0) && (
                <Card className="border-dashed border-2">
                  <CardContent className="p-8 text-center">
                    <Trophy className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-muted-foreground">
                      Vos objectifs accomplis apparaîtront ici
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Commencez votre première activité pour débloquer des récompenses !
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Points & Level */}
          <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white" data-testid="text-user-level">
                    {currentLevel}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">
                  Niveau {currentLevel} - {currentLevel === 1 ? "Débutant" : currentLevel <= 3 ? "Persévérant" : "Expert"}
                </h3>
                <p className="text-2xl font-bold text-primary mb-2" data-testid="text-user-points">
                  {currentPoints} points
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Prochain niveau</span>
                    <span className="font-medium">{nextLevelPoints - currentPoints} points</span>
                  </div>
                  <Progress 
                    value={progressToNextLevel} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Collection */}
          <Card>
            <CardHeader>
              <CardTitle>Collection de badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {userStats?.totalSessions > 0 && (
                  <div 
                    className="aspect-square bg-yellow-100 rounded-xl flex items-center justify-center" 
                    title="Premier pas"
                    data-testid="badge-first-step"
                  >
                    <Star className="text-yellow-600 text-xl" />
                  </div>
                )}
                {userStats?.cleanDayStreak >= 7 && (
                  <div 
                    className="aspect-square bg-blue-100 rounded-xl flex items-center justify-center" 
                    title="7 jours"
                    data-testid="badge-seven-days"
                  >
                    <Flame className="text-blue-600 text-xl" />
                  </div>
                )}
                {(userStats?.weeklyProgress?.exercises || 0) >= 10 && (
                  <div 
                    className="aspect-square bg-green-100 rounded-xl flex items-center justify-center" 
                    title="Sportif"
                    data-testid="badge-athlete"
                  >
                    <Dumbbell className="text-green-600 text-xl" />
                  </div>
                )}
                {/* Locked badges */}
                {Array.from({ length: Math.max(0, 6 - (
                  (userStats?.totalSessions > 0 ? 1 : 0) +
                  (userStats?.cleanDayStreak >= 7 ? 1 : 0) +
                  ((userStats?.weeklyProgress?.exercises || 0) >= 10 ? 1 : 0)
                )) }).map((_, index) => (
                  <div 
                    key={index}
                    className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center opacity-50" 
                    title="Verrouillé"
                    data-testid={`badge-locked-${index}`}
                  >
                    <Lock className="text-gray-400 text-xl" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Classement hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-yellow-600">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm" data-testid="leaderboard-first">
                      Alex M.
                    </p>
                    <p className="text-xs text-muted-foreground">485 points</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm" data-testid="leaderboard-second">
                      Sarah L.
                    </p>
                    <p className="text-xs text-muted-foreground">420 points</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-3 ${currentPoints >= 300 ? 'bg-primary/5 -mx-3 px-3 py-2 rounded-lg' : ''}`}>
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-primary" data-testid="leaderboard-user">
                      Vous
                    </p>
                    <p className="text-xs text-primary/70" data-testid="leaderboard-user-points">
                      {currentPoints} points
                    </p>
                  </div>
                  {currentPoints >= 300 && <Crown className="text-primary" size={20} />}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
