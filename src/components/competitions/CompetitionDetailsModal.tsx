"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Target,
  Zap,
  Heart as HeartIcon,
  Share2,
  Bookmark,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Trophy,
  CheckCircle,
  Shield,
  BarChart3,
  MapPin,
  CalendarDays,
  Timer,
  Users2
} from "lucide-react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface Competition {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  prizePool: number;
  status: string;
  organizer: string;
  imageUrl?: string;
  rules?: string[];
  categories?: string[];
  href?: string;
  myTeam?: {
    name: string;
    rank: number;
    score: number;
  };
  topTeams?: { 
    name: string; 
    score: number; 
    members: number 
  }[];
  duration?: string;
  prize?: string;
  participants?: number;
  teams?: number;
  features?: string[];
}

interface CompetitionDetailsModalProps {
  competition: Competition | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock simple pour useUser
const useUser = () => {
  return { user: { id: 1, name: "Test User" } };
};

export function CompetitionDetailsModal({ competition, isOpen, onClose }: CompetitionDetailsModalProps) {

  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // États pour les alertes
  const [showRegisterAlert, setShowRegisterAlert] = useState(false);
  const [showJoinTeamAlert, setShowJoinTeamAlert] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [questionText, setQuestionText] = useState("");

  const [showQuestionSent, setShowQuestionSent] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const { user } = useUser();

  // Réinitialiser l'état quand la modal s'ouvre
  useEffect(() => {
    if (isOpen && competition) {
      setHasRegistered(false);
      // Vérifier dans la base de données si l'utilisateur est inscrit
      checkUserRegistration(competition.id);
    }
  }, [isOpen, competition]);

  // Fonction pour vérifier l'inscription de l'utilisateur
  const checkUserRegistration = async (competitionId: number) => {
    if (!user) return setHasRegistered(false);
    // Simulation - à remplacer par un vrai appel API
    const isRegistered = Math.random() > 0.7; // 30% de chance d'être déjà inscrit
    setHasRegistered(isRegistered);
  };

  if (!competition) return null;

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: competition.title,
        text: competition.description,
        url: window.location.href,
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleRegister = () => {
    console.log('S\'inscrire à la compétition');
    setHasRegistered(true);
    setShowRegisterAlert(true);
  };

  const handleJoinTeam = () => {
    console.log('Rejoindre une équipe');
    setShowJoinTeamAlert(true);
  };

  const handleCall = () => {
    console.log('Appeler l\'organisateur');
    const phoneNumber = '+33 1 23 45 67 89';
    window.open(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    console.log('Envoyer un email à l\'organisateur');
    const subject = encodeURIComponent(`Question sur ${competition.title}`);
    const body = encodeURIComponent(`Bonjour ${competition.organizer},\n\nJ'ai une question concernant la compétition "${competition.title}".\n\nCordialement,`);
    window.open(`mailto:${competition.organizer.toLowerCase().replace(' ', '.')}@trainbuddy.com?subject=${subject}&body=${body}`);
  };

  const handleWebsite = () => {
    console.log('Visiter le site web');
    window.open('https://trainbuddy.com', '_blank');
  };

  const handleAskQuestion = () => {
    console.log('Poser une question');
    setShowQuestionDialog(true);
  };

  const handleSubmitQuestion = () => {
    if (questionText.trim()) {
      console.log('Question envoyée:', questionText);
      setShowQuestionDialog(false);
      setQuestionText("");
      setShowQuestionSent(true);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'endurance': return '🏃';
      case 'speed': return '⚡';
      case 'strength': return '💪';
      case 'team': return '👥';
      case 'individual': return '👤';
      case 'tennis': return '🎾';
      case 'running': return '🏃';
      case 'swimming': return '🏊';
      case 'cycling': return '🚴';
      default: return '🏆';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'finished': return 'bg-gray-100 text-gray-800';
      case 'registration': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'débutant': return 'bg-green-100 text-green-800';
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'avancé': return 'bg-red-100 text-red-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto px-8">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{competition.title}</DialogTitle>
          </VisuallyHidden>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {competition.title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-lg text-muted-foreground">
                {competition.description}
              </DialogDescription>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavorite}
                className={`hover:bg-red-50 ${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                <HeartIcon className={`size-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`hover:bg-blue-50 ${isBookmarked ? 'text-blue-500' : 'text-muted-foreground'}`}
              >
                <Bookmark className={`size-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground hover:bg-green-50"
              >
                <Share2 className="size-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image et badges principaux */}
          <div className="relative h-64 overflow-hidden rounded-lg bg-gradient-to-br from-amber-100 to-orange-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl opacity-20">
                {getCategoryIcon(competition.category)}
              </div>
            </div>
            
            {/* Badges */}
            <div className="absolute left-4 top-4 flex gap-2">
              <Badge 
                variant="secondary" 
                className={`rounded-sm text-xs ${getDifficultyColor(competition.difficulty)}`}
              >
                {competition.difficulty}
              </Badge>
              <Badge 
                variant="secondary" 
                className={`rounded-sm text-xs ${getStatusColor(competition.status)}`}
              >
                {competition.status}
              </Badge>
            </div>
            
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 backdrop-blur-sm">
              <Trophy className="size-4 text-yellow-500" />
              <span className="text-sm font-medium text-white">
                {competition.prize}
              </span>
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                    <CalendarDays className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Début</p>
                    <p className="font-semibold text-foreground">{formatDate(competition.startDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
                    <Timer className="size-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fin</p>
                    <p className="font-semibold text-foreground">{formatDate(competition.endDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-purple-100">
                    <Users2 className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="font-semibold text-foreground">{competition.participants || competition.currentParticipants}/{competition.maxParticipants}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-orange-100">
                    <span className="size-5 text-orange-600">€</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prix d&apos;inscription</p>
                    <p className="font-semibold text-foreground">{competition.entryFee}€</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description détaillée */}
          <Card className="border border-border bg-card/50">
            <CardContent className="p-6">
              <h3 className="mb-3 text-lg font-semibold text-foreground">À propos de cette compétition</h3>
              <p className="leading-relaxed text-muted-foreground">
                {competition.description}
              </p>
            </CardContent>
          </Card>

          {/* Informations pratiques */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border border-border bg-card/50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Informations pratiques</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Lieu: {competition.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Catégorie: {competition.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Durée: {competition.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Organisé par: {competition.organizer}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Contact et support</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={handleCall}>
                    <Phone className="mr-2 size-4" />
                    Appeler l&apos;organisateur
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleEmail}>
                    <Mail className="mr-2 size-4" />
                    Envoyer un email
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleWebsite}>
                    <Globe className="mr-2 size-4" />
                    Visiter le site web
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top équipes */}
          {competition.topTeams && competition.topTeams.length > 0 && (
            <Card className="border border-border bg-card/50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Classement actuel</h3>
                <div className="space-y-3">
                  {competition.topTeams.map((team, index) => (
                    <div key={team.name} className="flex items-center justify-between rounded-lg border border-border bg-card/30 p-4 transition-colors hover:bg-card/50">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
                          <span className="text-lg font-bold">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{team.name}</h4>
                          <p className="text-sm text-muted-foreground">{team.members} membres</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="size-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{team.score} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mon équipe si elle participe */}
          {competition.myTeam && (
            <Card className="border border-border bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Votre équipe</h3>
                <div className="flex items-center justify-between rounded-lg bg-card/30 p-4">
                  <div>
                    <h4 className="font-medium text-foreground">{competition.myTeam.name}</h4>
                    <p className="text-sm text-muted-foreground">Rang #{competition.myTeam.rank}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{competition.myTeam.score} pts</p>
                    <p className="text-sm text-muted-foreground">Score actuel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Caractéristiques */}
          {competition.features && competition.features.length > 0 && (
            <Card className="border border-border bg-card/50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Caractéristiques</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {competition.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="size-4 text-emerald-500" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions principales */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {!hasRegistered ? (
              <Button 
                className="flex-1"
                size="lg" 
                onClick={handleRegister}
              >
                <Trophy className="mr-2 size-4" />
                S&apos;inscrire à la compétition
              </Button>
            ) : (
              <Button 
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                size="lg" 
                onClick={handleJoinTeam}
              >
                <Users2 className="mr-2 size-4" />
                Rejoindre une équipe
              </Button>
            )}
            <Button variant="outline" className="flex-1" size="lg" onClick={handleAskQuestion}>
              <MessageCircle className="mr-2 size-4" />
              Poser une question
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Alertes */}
      <AlertDialog open={showRegisterAlert} onOpenChange={setShowRegisterAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inscription à la compétition</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes maintenant inscrit à la compétition &quot;{competition.title}&quot; ! Vous recevrez bientôt un email de confirmation avec tous les détails et les prochaines étapes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowRegisterAlert(false)}>
              Parfait !
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showJoinTeamAlert} onOpenChange={setShowJoinTeamAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejoindre une équipe</AlertDialogTitle>
            <AlertDialogDescription>
              Vous allez être redirigé vers la page de sélection d&apos;équipe pour rejoindre ou créer une équipe pour cette compétition.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowJoinTeamAlert(false)}>
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Poser une question</AlertDialogTitle>
            <AlertDialogDescription>
              Posez votre question concernant cette compétition. L&apos;organisateur vous répondra dans les plus brefs délais.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="question">Votre question</Label>
            <Input
              id="question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Tapez votre question ici..."
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setQuestionText("")}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitQuestion} disabled={!questionText.trim()}>
              Envoyer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showQuestionSent} onOpenChange={setShowQuestionSent}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Question envoyée !</AlertDialogTitle>
            <AlertDialogDescription>
              Votre question a été envoyée avec succès. L&apos;organisateur vous répondra dans les plus brefs délais.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowQuestionSent(false)}>
              Merci !
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
} 