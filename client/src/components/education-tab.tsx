import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Lightbulb, 
  Shield, 
  Clock, 
  BookOpen, 
  Users, 
  GraduationCap,
  BookAudio,
  HelpCircle,
  Trophy,
  Target
} from "lucide-react";

export default function EducationTab() {
  const { data: modules, isLoading } = useQuery({
    queryKey: ['/api/education-modules'],
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/stats/user'],
  });

  const continueModule = (moduleId: string) => {
    // TODO: Implement module continuation logic
    console.log('Continuing module:', moduleId);
  };

  const startModule = (moduleId: string) => {
    // TODO: Implement module start logic
    console.log('Starting module:', moduleId);
  };

  const startQuiz = () => {
    // TODO: Implement daily quiz
    console.log('Starting quiz');
  };

  const getProgressForModule = (moduleId: string) => {
    // Mock progress for now - in real app would come from user progress data
    const mockProgress = {
      'craving-module': 60,
      'triggers-module': 0,
      'prevention-module': 0,
    };
    return mockProgress[moduleId as keyof typeof mockProgress] || 0;
  };

  const overallProgress = userStats?.weeklyProgress?.education || 0;

  return (
    <div data-testid="education-tab">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Psychoéducation</h2>
        <p className="text-muted-foreground">Comprendre l'addiction pour mieux la gérer</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module Categories */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Mock essential module */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Brain className="text-white text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold" data-testid="module-craving-title">
                          Comprendre les craving
                        </h3>
                        <Badge className="bg-primary/10 text-primary" data-testid="module-craving-badge">
                          Essentiel
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Découvrez les mécanismes neurobiologiques derrière les envies et comment les reconnaître.
                      </p>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="text-muted-foreground" size={16} />
                          <span className="text-sm text-muted-foreground">25 min</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="text-muted-foreground" size={16} />
                          <span className="text-sm text-muted-foreground">5 chapitres</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="text-muted-foreground" size={16} />
                          <span className="text-sm text-muted-foreground">2.1k complétés</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progression</span>
                            <span className="font-medium" data-testid="module-craving-progress">
                              {getProgressForModule('craving-module')}%
                            </span>
                          </div>
                          <Progress 
                            value={getProgressForModule('craving-module')} 
                            className="h-2"
                          />
                        </div>
                        <Button
                          onClick={() => continueModule('craving-module')}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          data-testid="button-continue-craving-module"
                        >
                          Continuer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mock recommended module */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="text-white text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold" data-testid="module-triggers-title">
                          Identifier les déclencheurs
                        </h3>
                        <Badge className="bg-secondary/10 text-secondary" data-testid="module-triggers-badge">
                          Recommandé
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Apprenez à reconnaître les situations, émotions et pensées qui déclenchent vos envies.
                      </p>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="text-muted-foreground" size={16} />
                          <span className="text-sm text-muted-foreground">30 min</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="text-muted-foreground" size={16} />
                          <span className="text-sm text-muted-foreground">6 chapitres</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="text-muted-foreground" size={16} />
                          <span className="text-sm text-muted-foreground">1.8k complétés</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progression</span>
                            <span className="font-medium" data-testid="module-triggers-progress">
                              {getProgressForModule('triggers-module')}%
                            </span>
                          </div>
                          <Progress 
                            value={getProgressForModule('triggers-module')} 
                            className="h-2"
                          />
                        </div>
                        <Button
                          onClick={() => startModule('triggers-module')}
                          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                          data-testid="button-start-triggers-module"
                        >
                          Commencer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mock locked module */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-destructive rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="text-white text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold" data-testid="module-prevention-title">
                          Stratégies de prévention
                        </h3>
                        <Badge className="bg-accent/10 text-accent" data-testid="module-prevention-badge">
                          Avancé
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Développez un arsenal de techniques pour prévenir et gérer les rechutes.
                      </p>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="text-muted-foreground" size={16} />
                          <span className="text-sm text-muted-foreground">45 min</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="text-muted-foreground" size={16} />
                          <span className="text-sm text-muted-foreground">8 chapitres</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="text-muted-foreground" size={16} />
                          <span className="text-sm text-muted-foreground">1.2k complétés</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Verrouillé</span>
                            <span className="font-medium text-muted-foreground">
                              Terminez les modules précédents
                            </span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                        <Button
                          disabled
                          className="bg-muted text-muted-foreground cursor-not-allowed"
                          data-testid="button-locked-prevention-module"
                        >
                          Verrouillé
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Render actual modules from API if available */}
              {modules && modules.map((module: any) => (
                <Card key={module.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Brain className="text-white text-2xl" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold" data-testid={`module-title-${module.id}`}>
                            {module.title}
                          </h3>
                          <Badge className={module.isEssential ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}>
                            {module.isEssential ? "Essentiel" : "Optionnel"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4" data-testid={`module-description-${module.id}`}>
                          {module.description}
                        </p>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="text-muted-foreground" size={16} />
                            <span className="text-sm text-muted-foreground">{module.duration} min</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <BookOpen className="text-muted-foreground" size={16} />
                            <span className="text-sm text-muted-foreground">{module.chapters} chapitres</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="text-muted-foreground" size={16} />
                            <span className="text-sm text-muted-foreground">{module.completionCount} complétés</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progression</span>
                              <span className="font-medium">0%</span>
                            </div>
                            <Progress value={0} className="h-2" />
                          </div>
                          <Button
                            onClick={() => startModule(module.id)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            data-testid={`button-start-module-${module.id}`}
                          >
                            Commencer
                          </Button>
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Card>
              ))}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Votre progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center relative">
                    <span className="text-lg font-bold text-primary" data-testid="text-overall-progress">
                      {Math.round((overallProgress / 8) * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Progression globale</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Modules complétés</span>
                    <span className="font-medium" data-testid="text-completed-modules">
                      {overallProgress}/8
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Temps d'étude</span>
                    <span className="font-medium" data-testid="text-study-time">
                      {Math.floor((overallProgress * 25) / 60)}h {(overallProgress * 25) % 60}min
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Streak actuel</span>
                    <span className="font-medium" data-testid="text-education-streak">
                      {Math.max(0, overallProgress)} jours
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Badges récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overallProgress > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="text-yellow-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-sm" data-testid="badge-first-module-title">
                        Premier module
                      </p>
                      <p className="text-xs text-muted-foreground">Récemment</p>
                    </div>
                  </div>
                )}
                {overallProgress > 2 && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookAudio className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-sm" data-testid="badge-reader-title">
                        Lecteur assidu
                      </p>
                      <p className="text-xs text-muted-foreground">Il y a 3 jours</p>
                    </div>
                  </div>
                )}
                {overallProgress === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    <Trophy size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Commencez un module pour gagner des badges</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Quiz */}
          <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
            <CardHeader>
              <CardTitle>Quiz du jour</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Testez vos connaissances
              </p>
              <Button
                onClick={startQuiz}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-start-quiz"
              >
                <HelpCircle className="mr-2" size={16} />
                Commencer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
