"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  DollarSign,
  Users,
  Star,
  Calendar,
  Target,
  ArrowRight,
  Zap,
  Heart as HeartIcon,
  Share2,
  Bookmark,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Trophy,
  Award,
  CheckCircle,
  Play,
  User,
  TrendingUp,
  Shield,
  Activity,
  Medal,
  Flame,
  BarChart3,
  MapPin,
  CalendarDays,
  Timer,
  Users2,
  Prize,
  UserPlus,
  Crown,
  Settings,
  MoreHorizontal
} from "lucide-react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { mockApi } from "@/lib/api/mockApi";
import type { TableData } from "@/lib/mockDb";

interface GroupDetailsModalProps {
  group: TableData | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock simple pour useUser
const useUser = () => {
  return { user: { id: 1, name: "Test User" } };
};

export function GroupDetailsModal({ group, isOpen, onClose }: GroupDetailsModalProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // États pour les alertes
  const [showJoinAlert, setShowJoinAlert] = useState(false);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [showQuestionSent, setShowQuestionSent] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { user } = useUser();

  // Réinitialiser l'état quand la modal s'ouvre
  useEffect(() => {
    if (isOpen && group) {
      // Vérifier dans la base de données le statut de l'utilisateur
      checkUserStatus(Number(group.id));
    }
  }, [isOpen, group]);

  // Fonction pour vérifier le statut de l'utilisateur
  const checkUserStatus = async (groupId: number) => {
    if (!user) return;
    // Simulation - à remplacer par un vrai appel API
    const random = Math.random();
    setIsMember(random > 0.5);
    setIsAdmin(random > 0.8);
  };

  if (!group) return null;

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: String(group.name),
        text: String(group.description),
        url: window.location.href,
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleJoin = () => {
    console.log('Rejoindre le groupe');
    setIsMember(true);
    setShowJoinAlert(true);
  };

  const handleLeave = () => {
    console.log('Quitter le groupe');
    setIsMember(false);
    setShowLeaveAlert(true);
  };

  const handleCall = () => {
    console.log('Appeler l\'administrateur');
    const phoneNumber = '+33 1 23 45 67 89';
    window.open(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    console.log('Envoyer un email à l\'administrateur');
    const subject = encodeURIComponent(`Question sur ${group.name}`);
    const body = encodeURIComponent(`Bonjour,\n\nJ'ai une question concernant le groupe "${group.name}".\n\nCordialement,`);
    window.open(`mailto:admin@trainbuddy.com?subject=${subject}&body=${body}`);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'running': return '🏃';
      case 'strength': return '💪';
      case 'yoga': return '🧘';
      case 'cycling': return '🚴';
      case 'swimming': return '🏊';
      case 'crossfit': return '🔥';
      case 'cardio': return '❤️';
      case 'flexibility': return '🧘';
      case 'mindfulness': return '🧠';
      case 'nutrition': return '🥗';
      default: return '🏆';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto px-8">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{String(group.name)}</DialogTitle>
          </VisuallyHidden>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {String(group.name)}
              </DialogTitle>
              <DialogDescription className="mt-2 text-lg text-muted-foreground">
                {String(group.description)}
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
          <div className="relative h-64 overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl opacity-20">
                {getCategoryIcon(String(group.category))}
              </div>
            </div>
            
            {/* Badges */}
            <div className="absolute left-4 top-4 flex gap-2">
              <Badge 
                variant="secondary" 
                className={`rounded-sm text-xs ${getStatusColor(String(group.status))}`}
              >
                {String(group.status)}
              </Badge>
              <Badge 
                variant="secondary" 
                className="rounded-sm text-xs bg-blue-100 text-blue-800"
              >
                {String(group.category)}
              </Badge>
            </div>
            
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 backdrop-blur-sm">
              <Users className="size-4 text-white" />
              <span className="text-sm font-medium text-white">
                {String(group.totalMembers || 0)} membres
              </span>
            </div>

            {/* Avatar du groupe */}
            <div className="absolute inset-x-4 bottom-4">
              <div className="flex items-center justify-between rounded-lg bg-white/80 p-3 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage src={String(group.avatarUrl || '')} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {String(group.name).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">Créé par</p>
                    <p className="text-sm text-muted-foreground">{String(group.createdBy || 'Admin')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Sessions</p>
                  <p className="text-sm font-medium text-foreground">
                    {String(group.workoutCount || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                    <Users className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Membres</p>
                    <p className="font-semibold text-foreground">{String(group.totalMembers || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
                    <Calendar className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sessions</p>
                    <p className="font-semibold text-foreground">{String(group.workoutCount || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-purple-100">
                    <Activity className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Activité</p>
                    <p className="font-semibold text-foreground">Élevée</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-orange-100">
                    <Trophy className="size-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Niveau</p>
                    <p className="font-semibold text-foreground">{String(group.difficulty || 'Tous')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description détaillée */}
          <Card className="border border-border bg-card/50">
            <CardContent className="p-6">
              <h3 className="mb-3 text-lg font-semibold text-foreground">À propos de ce groupe</h3>
              <p className="leading-relaxed text-muted-foreground">
                {String(group.description)}
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
                    <Target className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Objectif: {String(group.objective || 'Fitness général')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Fréquence: {String(group.frequency || '2-3 fois/semaine')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Privacité: {String(group.privacy || 'Public')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Créé le: {new Date(String(group.createdAt || new Date())).toLocaleDateString('fr-FR')}</span>
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
                    Appeler l'administrateur
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

          {/* Actions principales */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {!isMember ? (
              <Button 
                className="flex-1"
                size="lg" 
                onClick={handleJoin}
              >
                <UserPlus className="mr-2 size-4" />
                Rejoindre le groupe
              </Button>
            ) : (
              <Button 
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
                size="lg" 
                onClick={handleLeave}
              >
                <Users className="mr-2 size-4" />
                Quitter le groupe
              </Button>
            )}
            {isAdmin && (
              <Button variant="outline" className="flex-1" size="lg">
                <Settings className="mr-2 size-4" />
                Gérer le groupe
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
      <AlertDialog open={showJoinAlert} onOpenChange={setShowJoinAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejoindre le groupe</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez rejoint le groupe &quot;{String(group.name)}&quot; ! Vous recevrez bientôt un email de confirmation et vous pourrez participer aux sessions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowJoinAlert(false)}>
              Parfait !
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLeaveAlert} onOpenChange={setShowLeaveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quitter le groupe</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez quitté le groupe &quot;{String(group.name)}&quot;. Vous ne recevrez plus les notifications de ce groupe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowLeaveAlert(false)}>
              Compris
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Poser une question</AlertDialogTitle>
            <AlertDialogDescription>
              Posez votre question concernant ce groupe. L'administrateur vous répondra dans les plus brefs délais.
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
              Votre question a été envoyée avec succès. L'administrateur vous répondra dans les plus brefs délais.
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