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
  BookOpen,
  Award,
  CheckCircle,
  Play,
  User,
  TrendingUp,
  Shield,
  Activity
} from "lucide-react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { mockApi } from "@/lib/api/mockApi";

interface Program {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  price: number;
  rating: number;
  participants: number;
  coach: string;
  imageUrl?: string;
  features?: string[];
  modules?: { id: number; title: string; duration: string; description: string }[];
  href?: string;
  nextSession?: string;
}

interface HealthProgramDetailsModalProps {
  program: Program | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock simple pour useUser
const useUser = () => {
  return { user: { id: 1, name: "Test User" } };
};

export function HealthProgramDetailsModal({ program, isOpen, onClose }: HealthProgramDetailsModalProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // États pour les alertes
  const [showEnrollAlert, setShowEnrollAlert] = useState(false);
  const [showStartAlert, setShowStartAlert] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [showQuestionSent, setShowQuestionSent] = useState(false);
  const [hasEnrolled, setHasEnrolled] = useState(false);

  const { user } = useUser();

  // Réinitialiser l'état quand la modal s'ouvre
  useEffect(() => {
    if (isOpen && program) {
      setHasEnrolled(false);
      // Vérifier dans la base de données si l'utilisateur est inscrit
      checkUserEnrollment(program.id);
    }
  }, [isOpen, program]);

  // Fonction pour vérifier l'inscription de l'utilisateur
  const checkUserEnrollment = async (programId: number) => {
    if (!user) return setHasEnrolled(false);
    // Simulation - à remplacer par un vrai appel API
    const isEnrolled = Math.random() > 0.7; // 30% de chance d'être déjà inscrit
    setHasEnrolled(isEnrolled);
  };

  if (!program) return null;

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: program.title,
        text: program.description,
        url: window.location.href,
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleEnroll = () => {
    console.log('S\'inscrire au programme');
    setHasEnrolled(true);
    setShowEnrollAlert(true);
  };

  const handleStartProgram = () => {
    console.log('Commencer le programme');
    setShowStartAlert(true);
  };

  const handleCall = () => {
    console.log('Appeler le coach');
    const phoneNumber = '+33 1 23 45 67 89';
    window.open(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    console.log('Envoyer un email au coach');
    const subject = encodeURIComponent(`Question sur ${program.title}`);
    const body = encodeURIComponent(`Bonjour ${program.coach},\n\nJ'ai une question concernant le programme "${program.title}".\n\nCordialement,`);
    window.open(`mailto:${program.coach.toLowerCase().replace(' ', '.')}@trainbuddy.com?subject=${subject}&body=${body}`);
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
      case 'cardio': return '❤️';
      case 'strength': return '💪';
      case 'flexibility': return '🧘';
      case 'mindfulness': return '🧠';
      case 'nutrition': return '🥗';
      case 'weight-loss': return '⚖️';
      case 'muscle-gain': return '🏋️';
      case 'wellness': return '🌿';
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cardio': return 'bg-red-100 text-red-800';
      case 'strength': return 'bg-blue-100 text-blue-800';
      case 'flexibility': return 'bg-purple-100 text-purple-800';
      case 'mindfulness': return 'bg-indigo-100 text-indigo-800';
      case 'nutrition': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto px-8">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{program.title}</DialogTitle>
          </VisuallyHidden>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {program.title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-lg text-muted-foreground">
                {program.description}
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
          <div className="relative h-64 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl opacity-20">
                {getCategoryIcon(program.category)}
              </div>
            </div>
            
            {/* Badges */}
            <div className="absolute left-4 top-4 flex gap-2">
              <Badge 
                variant="secondary" 
                className={`rounded-sm text-xs ${getCategoryColor(program.category)}`}
              >
                {program.category}
              </Badge>
              <Badge 
                variant="secondary" 
                className={`rounded-sm text-xs ${getDifficultyColor(program.difficulty)}`}
              >
                {program.difficulty}
              </Badge>
            </div>
            
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 backdrop-blur-sm">
              <Star className="size-4 fill-current text-yellow-500" />
              <span className="text-sm font-medium text-white">
                {program.rating}/5
              </span>
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Durée</p>
                    <p className="font-semibold text-foreground">{program.duration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
                    <DollarSign className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prix</p>
                    <p className="font-semibold text-foreground">{program.price}€</p>
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
                    <p className="font-semibold text-foreground">{program.participants}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-orange-100">
                    <Award className="size-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Coach</p>
                    <p className="font-semibold text-foreground">{program.coach}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description détaillée */}
          <Card className="border border-border bg-card/50">
            <CardContent className="p-6">
              <h3 className="mb-3 text-lg font-semibold text-foreground">À propos de ce programme</h3>
              <p className="leading-relaxed text-muted-foreground">
                {program.description}
              </p>
            </CardContent>
          </Card>

          {/* Modules du programme */}
          {program.modules && Array.isArray(program.modules) && program.modules.length > 0 && (
            <Card className="border border-border bg-card/50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Modules du programme</h3>
                <div className="space-y-3">
                  {program.modules.map((module, index) => (
                    <div key={module.id} className="flex items-center justify-between rounded-lg border border-border bg-card/30 p-4 transition-colors hover:bg-card/50">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{module.title}</h4>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {module.duration}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Play className="mr-2 size-3" />
                          Démarrer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Caractéristiques */}
          {program.features && program.features.length > 0 && (
            <Card className="border border-border bg-card/50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Caractéristiques</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {program.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="size-4 text-emerald-500" />
                      <span className="text-sm text-foreground">{feature}</span>
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
                    <span className="text-sm text-muted-foreground">
                      Prochaine session: {new Date(program.nextSession || new Date()).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Objectifs personnalisés selon votre niveau</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Suivi personnalisé inclus</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Garantie satisfaction 30 jours</span>
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
                    Appeler le coach
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
            {!hasEnrolled ? (
              <Button 
                className="flex-1"
                size="lg" 
                onClick={handleEnroll}
              >
                <BookOpen className="mr-2 size-4" />
                S'inscrire au programme
              </Button>
            ) : (
              <Button 
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                size="lg" 
                onClick={handleStartProgram}
              >
                <Play className="mr-2 size-4" />
                Commencer le programme
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
      <AlertDialog open={showEnrollAlert} onOpenChange={setShowEnrollAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inscription au programme</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes maintenant inscrit au programme &quot;{program.title}&quot; ! Vous recevrez bientôt un email de confirmation avec tous les détails et votre accès personnel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowEnrollAlert(false)}>
              Parfait !
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showStartAlert} onOpenChange={setShowStartAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Commencer le programme</AlertDialogTitle>
            <AlertDialogDescription>
              Vous allez être redirigé vers votre espace personnel pour commencer le programme &quot;{program.title}&quot;. Bonne chance dans votre transformation !
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowStartAlert(false)}>
              Commencer maintenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Poser une question</AlertDialogTitle>
            <AlertDialogDescription>
              Posez votre question concernant ce programme. Notre équipe ou votre coach vous répondra dans les plus brefs délais.
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