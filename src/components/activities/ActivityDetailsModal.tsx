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
import {
  Clock,
  MapPin,
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
} from "lucide-react";
import type { Activity } from "@/lib/mockDb";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { mockApi } from "@/lib/api/mockApi";

// Mock simple pour useUser
const useUser = () => {
  return { user: { id: 1, name: "Test User" } };
};

interface ActivityDetailsModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityDetailsModal({ activity, isOpen, onClose }: ActivityDetailsModalProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // États pour les alertes
  const [showJoinAlert, setShowJoinAlert] = useState(false);
  const [showParticipateAlert, setShowParticipateAlert] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [showQuestionSent, setShowQuestionSent] = useState(false);
  const [hasParticipated, setHasParticipated] = useState(false);

  const { user } = useUser();

  // Réinitialiser l'état quand la modal s'ouvre
  useEffect(() => {
    if (isOpen && activity) {
      setHasParticipated(false);
      // Vérifier dans la base de données si l'utilisateur participe déjà
      checkUserParticipation(activity.id);
    }
  }, [isOpen, activity]);

  // Fonction pour vérifier la participation de l'utilisateur
  const checkUserParticipation = async (activityId: number) => {
    if (!user) return setHasParticipated(false);
    const response = await mockApi.checkUserParticipation(activityId, user.id);
    setHasParticipated(response.data.isParticipating);
  };

  if (!activity) return null;

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activity.title,
        text: activity.description,
        url: window.location.href,
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleJoinGroup = (groupId: number) => {
    console.log(`Rejoindre le groupe ${groupId}`);
    setShowJoinAlert(true);
  };

  const handleCall = () => {
    console.log('Appeler pour réserver');
    // Ici vous pouvez ajouter la logique pour appeler
    alert('Fonctionnalité d\'appel à implémenter');
  };

  const handleEmail = () => {
    console.log('Envoyer un email');
    // Ici vous pouvez ajouter la logique pour envoyer un email
    const subject = encodeURIComponent(`Question sur ${activity.title}`);
    const body = encodeURIComponent(`Bonjour,\n\nJ'ai une question concernant l'activité "${activity.title}".\n\nCordialement,`);
    window.open(`mailto:contact@trainbuddy.com?subject=${subject}&body=${body}`);
  };

  const handleWebsite = () => {
    console.log('Visiter le site web');
    // Ici vous pouvez ajouter la logique pour ouvrir le site web
    window.open('https://trainbuddy.com', '_blank');
  };

  const handleParticipate = () => {
    console.log('Participer à l\'activité');
    setHasParticipated(true);
    setShowParticipateAlert(true);
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
      case 'outdoor': return '🌳';
      case 'indoor': return '🏢';
      case 'water': return '🌊';
      case 'sport': return '⚽';
      case 'fitness': return '💪';
      case 'yoga': return '🧘';
      case 'dance': return '💃';
      case 'music': return '🎵';
      default: return '🏆';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto px-8">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{activity.title}</DialogTitle>
          </VisuallyHidden>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {activity.title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-lg text-muted-foreground">
                {activity.description}
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
          <div className="relative h-64 overflow-hidden rounded-lg bg-gradient-to-br from-secondary to-muted">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl opacity-20">
                {getCategoryIcon(activity.category)}
              </div>
            </div>
            
            {/* Badges */}
            <div className="absolute left-4 top-4 flex gap-2">
              <Badge 
                variant="secondary" 
                className={`rounded-sm text-xs ${getDifficultyColor(activity.difficulty)}`}
              >
                {activity.difficulty}
              </Badge>
              <Badge variant="secondary" className="rounded-sm text-xs">
                {activity.category}
              </Badge>
            </div>
            
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 backdrop-blur-sm">
              <Star className="size-4 fill-current text-yellow-500" />
              <span className="text-sm font-medium text-white">
                {activity.popularity || 0}
              </span>
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Durée</p>
                    <p className="font-semibold text-foreground">{activity.duration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
                    <MapPin className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lieu</p>
                    <p className="font-semibold text-foreground">{activity.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-purple-100">
                    <Users className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="font-semibold text-foreground">{activity.participants}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description détaillée */}
          <Card className="border border-border bg-card/50">
            <CardContent className="p-6">
              <h3 className="mb-3 text-lg font-semibold text-foreground">À propos de cette activité</h3>
              <p className="leading-relaxed text-muted-foreground">
                {activity.description}
              </p>
            </CardContent>
          </Card>

          {/* Groupes associés */}
          {activity.groups && Array.isArray(activity.groups) && activity.groups.length > 0 && (
            <Card className="border border-border bg-card/50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Groupes disponibles</h3>
                <div className="space-y-3">
                  {activity.groups.map((group) => (
                    <div key={group.id} className="flex items-center justify-between rounded-lg border border-border bg-card/30 p-4 transition-colors hover:bg-card/50">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                          <Users className="size-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{group.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Niveau: {group.level} • Prochaine session: {group.nextSession}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {group.members} membres
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleJoinGroup(group.id)}>
                          Rejoindre
                          <ArrowRight className="ml-2 size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border border-border bg-card/50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Informations pratiques</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Disponible toute l&apos;année</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Objectifs adaptés à tous niveaux</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Équipement fourni sur place</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Contact et réservation</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={handleCall}>
                    <Phone className="mr-2 size-4" />
                    Appeler pour réserver
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
            <Button 
              className={`flex-1 ${hasParticipated ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
              size="lg" 
              onClick={handleParticipate}
              disabled={hasParticipated}
            >
              <Calendar className="mr-2 size-4" />
              {hasParticipated ? "Vous participez à cette activité" : "Participer"}
            </Button>
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
              Êtes-vous sûr de vouloir rejoindre ce groupe ? Vous recevrez des notifications pour les prochaines sessions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowJoinAlert(false)}>
              Rejoindre
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showParticipateAlert} onOpenChange={setShowParticipateAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Participer à l&apos;activité</AlertDialogTitle>
            <AlertDialogDescription>
              Vous participez maintenant à &quot;{activity.title}&quot; ! Vous recevrez bientôt un email de confirmation avec tous les détails.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowParticipateAlert(false)}>
              Parfait !
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Poser une question</AlertDialogTitle>
            <AlertDialogDescription>
              Posez votre question concernant cette activité. Notre équipe vous répondra dans les plus brefs délais.
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
              Votre question a été envoyée avec succès. Nous vous répondrons dans les plus brefs délais.
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