import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  UserX
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PatientsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  const { data: patients, isLoading } = useQuery({
    queryKey: ['/api/admin/patients'],
  });

  const deletePatientMutation = useMutation({
    mutationFn: async (patientId: string) => {
      return await apiRequest('DELETE', `/api/admin/patients/${patientId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/patients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Patient supprimé",
        description: "Le compte patient a été désactivé avec succès.",
      });
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    },
    onError: (error) => {
      console.error('Delete patient error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le patient.",
        variant: "destructive",
      });
    },
  });

  const filteredPatients = patients?.filter((patient: any) => {
    const matchesSearch = !searchTerm || 
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && patient.isActive) ||
      (statusFilter === "inactive" && !patient.isActive);
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleDeletePatient = (patientId: string) => {
    setPatientToDelete(patientId);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePatient = () => {
    if (patientToDelete) {
      deletePatientMutation.mutate(patientToDelete);
    }
  };

  const getPatientStatus = (patient: any) => {
    if (!patient.isActive) return "Inactif";
    
    // Check last activity
    const lastActivity = patient.profile?.lastActivity ? 
      new Date(patient.profile.lastActivity) : null;
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    if (lastActivity && lastActivity < twoDaysAgo) {
      return "Inactif";
    }
    
    return "Actif";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800";
      case "Inactif":
        return "bg-yellow-100 text-yellow-800";
      case "Urgence":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div data-testid="admin-patients-tab">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Gestion des patients</h2>
        <p className="text-muted-foreground">Surveillez et gérez les comptes patients</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-patients"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" data-testid="button-apply-filters">
                <Filter className="mr-2" size={16} />
                Filtrer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Patients ({filteredPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/6"></div>
                    </div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredPatients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Patient</th>
                    <th className="text-left p-4 font-medium">Inscription</th>
                    <th className="text-left p-4 font-medium">Dernière activité</th>
                    <th className="text-left p-4 font-medium">Sessions</th>
                    <th className="text-left p-4 font-medium">Statut</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient: any) => {
                    const status = getPatientStatus(patient);
                    const initials = `${patient.firstName?.[0] || ''}${patient.lastName?.[0] || ''}`.toUpperCase() || 'U';
                    
                    return (
                      <tr key={patient.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="font-medium text-primary" data-testid={`patient-initials-${patient.id}`}>
                                {initials}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium" data-testid={`patient-name-${patient.id}`}>
                                {patient.firstName} {patient.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground" data-testid={`patient-email-${patient.id}`}>
                                {patient.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground" data-testid={`patient-created-${patient.id}`}>
                          {new Date(patient.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="p-4 text-muted-foreground" data-testid={`patient-activity-${patient.id}`}>
                          {patient.profile?.lastActivity ? 
                            new Date(patient.profile.lastActivity).toLocaleDateString('fr-FR') : 
                            'Jamais'
                          }
                        </td>
                        <td className="p-4">
                          <span className="font-medium" data-testid={`patient-sessions-${patient.id}`}>
                            {patient.profile?.totalSessions || 0}
                          </span>
                          <span className="text-sm text-muted-foreground"> sessions</span>
                        </td>
                        <td className="p-4">
                          <Badge 
                            className={getStatusBadgeClass(status)}
                            data-testid={`patient-status-${patient.id}`}
                          >
                            {status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary/80"
                              data-testid={`button-view-patient-${patient.id}`}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-accent hover:text-accent/80"
                              data-testid={`button-edit-patient-${patient.id}`}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive/80"
                              onClick={() => handleDeletePatient(patient.id)}
                              data-testid={`button-delete-patient-${patient.id}`}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <UserX className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" ? "Aucun patient trouvé avec ces critères" : "Aucun patient inscrit"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm || statusFilter !== "all" ? "Modifiez vos filtres pour voir plus de résultats" : "Les nouveaux patients apparaîtront ici"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="delete-patient-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le patient</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce patient ? Cette action désactivera son compte 
              et il ne pourra plus se connecter à l'application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePatient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
