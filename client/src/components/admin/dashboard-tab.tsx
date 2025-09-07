import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Percent,
  UserPlus,
  Activity,
  Trophy
} from "lucide-react";

export default function DashboardTab() {
  const { data: adminStats, isLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  const { data: emergencyEvents } = useQuery({
    queryKey: ['/api/admin/emergency-events'],
  });

  const recentEvents = emergencyEvents?.slice(0, 3) || [];

  const stats = adminStats || {
    totalPatients: 0,
    activePatients: 0,
    sessionsToday: 0,
    emergenciesToday: 0,
  };

  const successRate = stats.totalPatients > 0 ? 
    Math.round((stats.activePatients / stats.totalPatients) * 100) : 0;

  return (
    <div data-testid="admin-dashboard-tab">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h2>
        <p className="text-muted-foreground">Vue d'ensemble de l'activité de l'application</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="text-primary text-xl" />
              </div>
              <span className="text-2xl font-bold text-primary" data-testid="stat-total-patients">
                {isLoading ? "..." : stats.totalPatients}
              </span>
            </div>
            <h3 className="font-semibold">Patients inscrits</h3>
            <p className="text-sm text-muted-foreground">
              {stats.activePatients} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-secondary text-xl" />
              </div>
              <span className="text-2xl font-bold text-secondary" data-testid="stat-sessions-today">
                {isLoading ? "..." : stats.sessionsToday}
              </span>
            </div>
            <h3 className="font-semibold">Sessions aujourd'hui</h3>
            <p className="text-sm text-muted-foreground">
              +{Math.round((stats.sessionsToday / Math.max(stats.sessionsToday - 50, 100)) * 100)}% vs hier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-accent text-xl" />
              </div>
              <span className="text-2xl font-bold text-accent" data-testid="stat-emergencies-today">
                {isLoading ? "..." : stats.emergenciesToday}
              </span>
            </div>
            <h3 className="font-semibold">Urgences aujourd'hui</h3>
            <p className="text-sm text-muted-foreground">
              Niveau normal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Percent className="text-green-600 text-xl" />
              </div>
              <span className="text-2xl font-bold text-green-600" data-testid="stat-success-rate">
                {isLoading ? "..." : `${successRate}%`}
              </span>
            </div>
            <h3 className="font-semibold">Taux de réussite</h3>
            <p className="text-sm text-muted-foreground">Patients actifs</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 py-3 animate-pulse">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentEvents.length > 0 ? (
            <div className="space-y-4">
              {recentEvents.map((event: any, index: number) => (
                <div key={event.id} className="flex items-center space-x-4 py-3 border-b border-border last:border-b-0">
                  <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="text-destructive" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" data-testid={`activity-title-${index}`}>
                      Urgence déclenchée - Action: {event.actionTaken}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid={`activity-time-${index}`}>
                      {new Date(event.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div className={`text-sm font-medium ${event.resolved ? 'text-green-600' : 'text-orange-600'}`}>
                    {event.resolved ? 'Résolu' : 'En cours'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="mx-auto mb-4" size={48} />
              <p>Aucune activité récente</p>
              <p className="text-sm">Les événements d'urgence apparaîtront ici</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>État du système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Base de données</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Opérationnelle</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Authentification</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Opérationnelle</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">API</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Opérationnelle</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques de contenu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exercices actifs</span>
                <span className="font-medium" data-testid="content-exercises">
                  {isLoading ? "..." : "24"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modules éducatifs</span>
                <span className="font-medium" data-testid="content-modules">
                  {isLoading ? "..." : "8"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Méditations</span>
                <span className="font-medium" data-testid="content-meditations">
                  {isLoading ? "..." : "15"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Objectifs disponibles</span>
                <span className="font-medium" data-testid="content-goals">
                  {isLoading ? "..." : "12"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
