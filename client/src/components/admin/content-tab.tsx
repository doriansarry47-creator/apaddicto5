import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Dumbbell, 
  Brain, 
  Leaf,
  Download,
  Upload,
  FileText,
  Target
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type ContentType = 'exercise' | 'meditation' | 'education' | 'goal';

interface ExerciseForm {
  title: string;
  description: string;
  instructions: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  imageUrl: string;
}

interface MeditationForm {
  title: string;
  description: string;
  duration: number;
  type: string;
  audioUrl: string;
}

interface EducationForm {
  title: string;
  description: string;
  content: string;
  duration: number;
  chapters: number;
  isEssential: boolean;
}

interface GoalForm {
  title: string;
  description: string;
  type: string;
  target: number;
  pointsReward: number;
  badgeIcon: string;
}

export default function ContentTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('exercise');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [exerciseForm, setExerciseForm] = useState<ExerciseForm>({
    title: '',
    description: '',
    instructions: '',
    duration: 5,
    difficulty: 'beginner',
    category: 'cardio',
    imageUrl: '',
  });

  const [meditationForm, setMeditationForm] = useState<MeditationForm>({
    title: '',
    description: '',
    duration: 5,
    type: 'breathing',
    audioUrl: '',
  });

  const [educationForm, setEducationForm] = useState<EducationForm>({
    title: '',
    description: '',
    content: '',
    duration: 15,
    chapters: 3,
    isEssential: false,
  });

  const [goalForm, setGoalForm] = useState<GoalForm>({
    title: '',
    description: '',
    type: 'daily',
    target: 10,
    pointsReward: 50,
    badgeIcon: 'star',
  });

  // Queries
  const { data: exercises } = useQuery({
    queryKey: ['/api/exercises'],
  });

  const { data: meditations } = useQuery({
    queryKey: ['/api/meditations'],
  });

  const { data: educationModules } = useQuery({
    queryKey: ['/api/education-modules'],
  });

  const { data: goals } = useQuery({
    queryKey: ['/api/goals'],
  });

  // Mutations
  const createExerciseMutation = useMutation({
    mutationFn: async (data: ExerciseForm) => {
      return await apiRequest('POST', '/api/exercises', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/exercises'] });
      toast({ title: "Exercice créé", description: "L'exercice a été ajouté avec succès." });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Impossible de créer l'exercice.", variant: "destructive" });
    },
  });

  const createMeditationMutation = useMutation({
    mutationFn: async (data: MeditationForm) => {
      return await apiRequest('POST', '/api/meditations', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meditations'] });
      toast({ title: "Méditation créée", description: "La méditation a été ajoutée avec succès." });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Impossible de créer la méditation.", variant: "destructive" });
    },
  });

  const createEducationMutation = useMutation({
    mutationFn: async (data: EducationForm) => {
      return await apiRequest('POST', '/api/education-modules', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/education-modules'] });
      toast({ title: "Module créé", description: "Le module éducatif a été ajouté avec succès." });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Impossible de créer le module.", variant: "destructive" });
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data: GoalForm) => {
      return await apiRequest('POST', '/api/goals', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({ title: "Objectif créé", description: "L'objectif a été ajouté avec succès." });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Impossible de créer l'objectif.", variant: "destructive" });
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string, id: string }) => {
      return await apiRequest('DELETE', `/api/${type}s/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/${variables.type}s`] });
      toast({ title: "Contenu supprimé", description: "Le contenu a été supprimé avec succès." });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: "Impossible de supprimer le contenu.", variant: "destructive" });
    },
  });

  const handleOpenCreateDialog = (type: ContentType) => {
    setContentType(type);
    setEditingItem(null);
    resetForms();
    setShowCreateDialog(true);
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setEditingItem(null);
    resetForms();
  };

  const resetForms = () => {
    setExerciseForm({
      title: '',
      description: '',
      instructions: '',
      duration: 5,
      difficulty: 'beginner',
      category: 'cardio',
      imageUrl: '',
    });
    setMeditationForm({
      title: '',
      description: '',
      duration: 5,
      type: 'breathing',
      audioUrl: '',
    });
    setEducationForm({
      title: '',
      description: '',
      content: '',
      duration: 15,
      chapters: 3,
      isEssential: false,
    });
    setGoalForm({
      title: '',
      description: '',
      type: 'daily',
      target: 10,
      pointsReward: 50,
      badgeIcon: 'star',
    });
  };

  const handleSubmit = () => {
    switch (contentType) {
      case 'exercise':
        createExerciseMutation.mutate(exerciseForm);
        break;
      case 'meditation':
        createMeditationMutation.mutate(meditationForm);
        break;
      case 'education':
        createEducationMutation.mutate(educationForm);
        break;
      case 'goal':
        createGoalMutation.mutate(goalForm);
        break;
    }
  };

  const handleDeleteContent = (type: string, id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      deleteContentMutation.mutate({ type, id });
    }
  };

  const renderCreateForm = () => {
    switch (contentType) {
      case 'exercise':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={exerciseForm.title}
                onChange={(e) => setExerciseForm({...exerciseForm, title: e.target.value})}
                data-testid="input-exercise-title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={exerciseForm.description}
                onChange={(e) => setExerciseForm({...exerciseForm, description: e.target.value})}
                data-testid="textarea-exercise-description"
              />
            </div>
            <div>
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={exerciseForm.instructions}
                onChange={(e) => setExerciseForm({...exerciseForm, instructions: e.target.value})}
                data-testid="textarea-exercise-instructions"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={exerciseForm.duration}
                  onChange={(e) => setExerciseForm({...exerciseForm, duration: parseInt(e.target.value)})}
                  data-testid="input-exercise-duration"
                />
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulté</Label>
                <Select
                  value={exerciseForm.difficulty}
                  onValueChange={(value: any) => setExerciseForm({...exerciseForm, difficulty: value})}
                >
                  <SelectTrigger data-testid="select-exercise-difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Input
                id="category"
                value={exerciseForm.category}
                onChange={(e) => setExerciseForm({...exerciseForm, category: e.target.value})}
                placeholder="ex: cardio, yoga, respiration"
                data-testid="input-exercise-category"
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">URL de l'image (optionnel)</Label>
              <Input
                id="imageUrl"
                value={exerciseForm.imageUrl}
                onChange={(e) => setExerciseForm({...exerciseForm, imageUrl: e.target.value})}
                placeholder="https://..."
                data-testid="input-exercise-image"
              />
            </div>
          </div>
        );

      case 'meditation':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={meditationForm.title}
                onChange={(e) => setMeditationForm({...meditationForm, title: e.target.value})}
                data-testid="input-meditation-title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={meditationForm.description}
                onChange={(e) => setMeditationForm({...meditationForm, description: e.target.value})}
                data-testid="textarea-meditation-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={meditationForm.duration}
                  onChange={(e) => setMeditationForm({...meditationForm, duration: parseInt(e.target.value)})}
                  data-testid="input-meditation-duration"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={meditationForm.type}
                  onValueChange={(value) => setMeditationForm({...meditationForm, type: value})}
                >
                  <SelectTrigger data-testid="select-meditation-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breathing">Respiration</SelectItem>
                    <SelectItem value="mindfulness">Pleine conscience</SelectItem>
                    <SelectItem value="visualization">Visualisation</SelectItem>
                    <SelectItem value="relaxation">Relaxation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="audioUrl">URL audio (optionnel)</Label>
              <Input
                id="audioUrl"
                value={meditationForm.audioUrl}
                onChange={(e) => setMeditationForm({...meditationForm, audioUrl: e.target.value})}
                placeholder="https://..."
                data-testid="input-meditation-audio"
              />
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={educationForm.title}
                onChange={(e) => setEducationForm({...educationForm, title: e.target.value})}
                data-testid="input-education-title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={educationForm.description}
                onChange={(e) => setEducationForm({...educationForm, description: e.target.value})}
                data-testid="textarea-education-description"
              />
            </div>
            <div>
              <Label htmlFor="content">Contenu du module</Label>
              <Textarea
                id="content"
                value={educationForm.content}
                onChange={(e) => setEducationForm({...educationForm, content: e.target.value})}
                rows={6}
                data-testid="textarea-education-content"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={educationForm.duration}
                  onChange={(e) => setEducationForm({...educationForm, duration: parseInt(e.target.value)})}
                  data-testid="input-education-duration"
                />
              </div>
              <div>
                <Label htmlFor="chapters">Nombre de chapitres</Label>
                <Input
                  id="chapters"
                  type="number"
                  value={educationForm.chapters}
                  onChange={(e) => setEducationForm({...educationForm, chapters: parseInt(e.target.value)})}
                  data-testid="input-education-chapters"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isEssential"
                checked={educationForm.isEssential}
                onChange={(e) => setEducationForm({...educationForm, isEssential: e.target.checked})}
                data-testid="checkbox-education-essential"
              />
              <Label htmlFor="isEssential">Module essentiel</Label>
            </div>
          </div>
        );

      case 'goal':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={goalForm.title}
                onChange={(e) => setGoalForm({...goalForm, title: e.target.value})}
                data-testid="input-goal-title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={goalForm.description}
                onChange={(e) => setGoalForm({...goalForm, description: e.target.value})}
                data-testid="textarea-goal-description"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={goalForm.type}
                  onValueChange={(value) => setGoalForm({...goalForm, type: value})}
                >
                  <SelectTrigger data-testid="select-goal-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="milestone">Étape importante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="target">Objectif cible</Label>
                <Input
                  id="target"
                  type="number"
                  value={goalForm.target}
                  onChange={(e) => setGoalForm({...goalForm, target: parseInt(e.target.value)})}
                  data-testid="input-goal-target"
                />
              </div>
              <div>
                <Label htmlFor="pointsReward">Points de récompense</Label>
                <Input
                  id="pointsReward"
                  type="number"
                  value={goalForm.pointsReward}
                  onChange={(e) => setGoalForm({...goalForm, pointsReward: parseInt(e.target.value)})}
                  data-testid="input-goal-points"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="badgeIcon">Icône du badge</Label>
              <Select
                value={goalForm.badgeIcon}
                onValueChange={(value) => setGoalForm({...goalForm, badgeIcon: value})}
              >
                <SelectTrigger data-testid="select-goal-badge">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="star">Étoile</SelectItem>
                  <SelectItem value="trophy">Trophée</SelectItem>
                  <SelectItem value="fire">Flamme</SelectItem>
                  <SelectItem value="heart">Cœur</SelectItem>
                  <SelectItem value="target">Cible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div data-testid="admin-content-tab">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Gestion du contenu</h2>
        <p className="text-muted-foreground">Modifiez les exercices, modules et contenus de l'application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content Categories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exercises */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Dumbbell className="mr-2" size={20} />
                  Exercices physiques
                </CardTitle>
                <Button
                  onClick={() => handleOpenCreateDialog('exercise')}
                  size="sm"
                  data-testid="button-add-exercise"
                >
                  <Plus className="mr-2" size={16} />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exercises && exercises.length > 0 ? (
                  exercises.slice(0, 3).map((exercise: any) => (
                    <div key={exercise.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium" data-testid={`exercise-item-${exercise.id}`}>
                          {exercise.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Durée: {exercise.duration} min • Niveau: {exercise.difficulty}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-accent hover:text-accent/80"
                          data-testid={`button-edit-exercise-${exercise.id}`}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => handleDeleteContent('exercise', exercise.id)}
                          data-testid={`button-delete-exercise-${exercise.id}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Dumbbell size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Aucun exercice disponible</p>
                    <p className="text-sm">Ajoutez votre premier exercice</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Meditations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2" size={20} />
                  Méditations
                </CardTitle>
                <Button
                  onClick={() => handleOpenCreateDialog('meditation')}
                  size="sm"
                  data-testid="button-add-meditation"
                >
                  <Plus className="mr-2" size={16} />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meditations && meditations.length > 0 ? (
                  meditations.slice(0, 3).map((meditation: any) => (
                    <div key={meditation.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium" data-testid={`meditation-item-${meditation.id}`}>
                          {meditation.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Durée: {meditation.duration} min • Type: {meditation.type}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-accent hover:text-accent/80"
                          data-testid={`button-edit-meditation-${meditation.id}`}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => handleDeleteContent('meditation', meditation.id)}
                          data-testid={`button-delete-meditation-${meditation.id}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Leaf size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Aucune méditation disponible</p>
                    <p className="text-sm">Ajoutez votre première méditation</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education Modules */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Brain className="mr-2" size={20} />
                  Modules de psychoéducation
                </CardTitle>
                <Button
                  onClick={() => handleOpenCreateDialog('education')}
                  size="sm"
                  data-testid="button-add-education"
                >
                  <Plus className="mr-2" size={16} />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {educationModules && educationModules.length > 0 ? (
                  educationModules.slice(0, 3).map((module: any) => (
                    <div key={module.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium" data-testid={`education-item-${module.id}`}>
                          {module.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {module.chapters} chapitres • {module.duration} min
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-accent hover:text-accent/80"
                          data-testid={`button-edit-education-${module.id}`}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => handleDeleteContent('education-module', module.id)}
                          data-testid={`button-delete-education-${module.id}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Aucun module disponible</p>
                    <p className="text-sm">Ajoutez votre premier module</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Target className="mr-2" size={20} />
                  Objectifs
                </CardTitle>
                <Button
                  onClick={() => handleOpenCreateDialog('goal')}
                  size="sm"
                  data-testid="button-add-goal"
                >
                  <Plus className="mr-2" size={16} />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals && goals.length > 0 ? (
                  goals.slice(0, 3).map((goal: any) => (
                    <div key={goal.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium" data-testid={`goal-item-${goal.id}`}>
                          {goal.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {goal.type} • {goal.pointsReward} points
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-accent hover:text-accent/80"
                          data-testid={`button-edit-goal-${goal.id}`}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => handleDeleteContent('goal', goal.id)}
                          data-testid={`button-delete-goal-${goal.id}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Aucun objectif disponible</p>
                    <p className="text-sm">Ajoutez votre premier objectif</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                data-testid="button-export-content"
              >
                <Download className="mr-2" size={16} />
                Exporter contenu
              </Button>
              <Button
                variant="outline"
                className="w-full"
                data-testid="button-import-content"
              >
                <Upload className="mr-2" size={16} />
                Importer contenu
              </Button>
            </CardContent>
          </Card>

          {/* Content Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques du contenu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exercices</span>
                <span className="font-medium" data-testid="stat-exercises-count">
                  {exercises?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Méditations</span>
                <span className="font-medium" data-testid="stat-meditations-count">
                  {meditations?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modules éducatifs</span>
                <span className="font-medium" data-testid="stat-education-count">
                  {educationModules?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Objectifs</span>
                <span className="font-medium" data-testid="stat-goals-count">
                  {goals?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl" data-testid="create-content-dialog">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Modifier' : 'Créer'} {
                contentType === 'exercise' ? 'un exercice' :
                contentType === 'meditation' ? 'une méditation' :
                contentType === 'education' ? 'un module éducatif' :
                'un objectif'
              }
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour {editingItem ? 'modifier' : 'créer'} le contenu.
            </DialogDescription>
          </DialogHeader>
          
          {renderCreateForm()}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              data-testid="button-cancel-create"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createExerciseMutation.isPending || createMeditationMutation.isPending || 
                       createEducationMutation.isPending || createGoalMutation.isPending}
              data-testid="button-confirm-create"
            >
              {editingItem ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
