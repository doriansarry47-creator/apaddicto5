import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pause, Play, Square } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  instructions: string;
}

interface ExerciseTimerProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExerciseTimer({ exercise, isOpen, onClose }: ExerciseTimerProps) {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(exercise.duration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const totalTime = exercise.duration * 60;

  const sessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return await apiRequest('POST', '/api/sessions', sessionData);
    },
    onSuccess: () => {
      toast({
        title: "Session complétée !",
        description: `Vous avez terminé ${exercise.title}`,
      });
    },
    onError: (error) => {
      console.error('Session error:', error);
    },
  });

  const handleComplete = useCallback(() => {
    const completedDuration = Math.ceil((totalTime - timeLeft) / 60);
    sessionMutation.mutate({
      contentType: 'exercise',
      contentId: exercise.id,
      duration: completedDuration,
      completed: timeLeft === 0,
      pointsEarned: timeLeft === 0 ? 10 : Math.floor(completedDuration / 2),
    });
    onClose();
  }, [timeLeft, totalTime, exercise.id, exercise.title, sessionMutation, onClose]);

  useEffect(() => {
    if (!isRunning || isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft, handleComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhase = () => {
    if (exercise.id.includes('breathing')) {
      const cycle = Math.floor((totalTime - timeLeft) / 14) % 3;
      return ['Inspirez', 'Retenez', 'Expirez'][cycle];
    }
    return 'En cours';
  };

  const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    const completedDuration = Math.ceil((totalTime - timeLeft) / 60);
    if (completedDuration > 0) {
      sessionMutation.mutate({
        contentType: 'exercise',
        contentId: exercise.id,
        duration: completedDuration,
        completed: false,
        pointsEarned: Math.floor(completedDuration / 2),
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-8" data-testid="exercise-timer-modal">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2" data-testid="exercise-title">
            {exercise.title}
          </h2>
          <p className="text-muted-foreground mb-8" data-testid="exercise-description">
            {exercise.description}
          </p>
          
          {/* Timer Display */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                className="text-muted opacity-20"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                className="text-primary transition-all duration-1000 ease-linear"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold" data-testid="timer-display">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-muted-foreground" data-testid="timer-phase">
                  {getPhase()}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={handlePause}
              variant="outline"
              className="px-6 py-3"
              data-testid="button-pause-timer"
            >
              {isPaused ? <Play className="mr-2" size={16} /> : <Pause className="mr-2" size={16} />}
              {isPaused ? 'Reprendre' : 'Pause'}
            </Button>
            <Button
              onClick={handleStop}
              variant="destructive"
              className="px-6 py-3"
              data-testid="button-stop-exercise"
            >
              <Square className="mr-2" size={16} />
              Arrêter
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-muted rounded-xl p-4">
            <h4 className="font-medium mb-2">Instructions</h4>
            <p className="text-sm text-muted-foreground" data-testid="exercise-instructions">
              {exercise.instructions}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
