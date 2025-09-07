import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sprout, Mountain, Flame, Star, Users } from "lucide-react";
import ExerciseTimer from "./exercise-timer";

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export default function ExercisesTab() {
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>('beginner');
  const [showTimer, setShowTimer] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['/api/exercises', selectedLevel],
  });

  const levels = [
    { id: 'beginner', label: 'Débutant', icon: Sprout },
    { id: 'intermediate', label: 'Intermédiaire', icon: Mountain },
    { id: 'advanced', label: 'Avancé', icon: Flame },
  ] as const;

  const startExercise = (exercise: any) => {
    setSelectedExercise(exercise);
    setShowTimer(true);
  };

  const getDefaultImage = (category: string) => {
    const images = {
      breathing: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      cardio: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      walking: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      strength: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      taichi: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    };
    return images[category as keyof typeof images] || images.breathing;
  };

  return (
    <div data-testid="exercises-tab">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Exercices Physiques</h2>
        <p className="text-muted-foreground">Gérez vos craving avec des exercices adaptés à votre niveau</p>
      </div>

      {/* Level Selection */}
      <div className="mb-8">
        <div className="flex space-x-4 bg-muted rounded-lg p-1">
          {levels.map((level) => {
            const IconComponent = level.icon;
            return (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  selectedLevel === level.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`level-${level.id}`}
              >
                <IconComponent className="mr-2 inline" size={16} />
                {level.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exercise Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted"></div>
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded mb-3"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises && exercises.length > 0 ? (
            exercises.map((exercise: any) => (
              <Card key={exercise.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={exercise.imageUrl || getDefaultImage(exercise.category)}
                  alt={exercise.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg" data-testid={`exercise-title-${exercise.id}`}>
                      {exercise.title}
                    </h3>
                    <Badge variant="secondary" data-testid={`exercise-duration-${exercise.id}`}>
                      {exercise.duration} min
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4" data-testid={`exercise-description-${exercise.id}`}>
                    {exercise.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="text-yellow-500" size={16} />
                      <span className="text-sm font-medium" data-testid={`exercise-rating-${exercise.id}`}>
                        {(exercise.rating / 10).toFixed(1)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid={`exercise-completions-${exercise.id}`}>
                      <Users className="inline mr-1" size={14} />
                      {exercise.completionCount} utilisateurs
                    </div>
                  </div>
                  <Button
                    onClick={() => startExercise(exercise)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid={`button-start-exercise-${exercise.id}`}
                  >
                    Commencer
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Aucun exercice disponible pour ce niveau.</p>
            </div>
          )}
        </div>
      )}

      {/* Exercise Timer */}
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
