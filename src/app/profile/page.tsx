"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/hooks/user";
import {
  User,
  Settings,
  Camera,
  Bell,
  Shield,
  LogOut,
  Mail,
  UserCircle,
  Target
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const ALL_OBJECTIVES = [
  "Perte de poids",
  "Prise de masse",
  "Améliorer mon endurance",
  "Améliorer ma force",
  "Participer à un semi-marathon",
  "Réduction du stress",
];

const ALL_SPORTS = [
  "Yoga",
  "Course à pied",
  "Natation",
  "Musculation",
  "Vélo",
  "Randonnée",
  "Boxe",
  "Pilates",
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, loading, error } = useUser(1); // On charge l'utilisateur avec l'ID 1

  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setSelectedObjectives((user.objectives as string[]) || []);
      setSelectedSports((user.sports as string[]) || []);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto size-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-red-600">
          Erreur: {error || "Utilisateur non trouvé"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mon Compte</h1>
          <p className="text-slate-600">
            Gérez votre profil, vos paramètres et vos préférences.
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="size-24 border-4 border-white shadow-lg">
                <AvatarImage
                  src={user.avatarUrl as string}
                  alt={user.username as string}
                />
                <AvatarFallback className="bg-slate-200 text-lg font-semibold text-slate-700">
                  {`${(user.firstName as string)?.[0] || ""}${(user.lastName as string)?.[0] || ""}`}
                </AvatarFallback>
              </Avatar>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 size-8 rounded-full p-0"
                  >
                    <Camera className="size-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier la photo de profil</DialogTitle>
                    <DialogDescription>
                      Entrez l&apos;URL de votre nouvelle image ou téléchargez un fichier.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="avatarUrl">URL de l&apos;image</Label>
                      <Input
                        id="avatarUrl"
                        placeholder="https://exemple.com/image.jpg"
                        defaultValue={user.avatarUrl as string}
                      />
                    </div>
                    <div className="text-center text-sm text-slate-500">OU</div>
                    <Button variant="outline" className="w-full">
                      Télécharger un fichier
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost">Annuler</Button>
                    <Button>Enregistrer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-slate-900">{`${user.firstName} ${user.lastName}`}</h2>
                <Badge
                  variant="secondary"
                  className="rounded-sm bg-green-100 capitalize text-green-800"
                >
                  {user.role as string}
                </Badge>
              </div>
              <p className="mb-3 text-slate-600">{user.email as string}</p>
              <p className="text-sm italic text-slate-500">&quot;{user.description as string}&quot;</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 bg-slate-100">
          <TabsTrigger value="profile">
            <User className="mr-2 size-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 size-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>
                Vos informations de profil publiques.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <UserCircle className="mr-3 size-5 text-slate-500" />
                <span className="font-medium">Prénom :</span>
                <span className="ml-2 text-slate-700">{user.firstName as string}</span>
              </div>
              <div className="flex items-center">
                <UserCircle className="mr-3 size-5 text-slate-500" />
                <span className="font-medium">Nom :</span>
                <span className="ml-2 text-slate-700">{user.lastName as string}</span>
              </div>
              <div className="flex items-center">
                <UserCircle className="mr-3 size-5 text-slate-500" />
                <span className="font-medium">Nom d&apos;utilisateur :</span>
                <span className="ml-2 text-slate-700">{user.username as string}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-3 size-5 text-slate-500" />
                <span className="font-medium">Email :</span>
                <span className="ml-2 text-slate-700">
                  {user.email as string}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-5" />
                Objectifs et Sports
              </CardTitle>
              <CardDescription>Vos centres d&apos;intérêt et motivations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Objectifs</h3>
                <div className="flex flex-wrap gap-2">
                  {(user.objectives as string[] || []).map((objective, index) => (
                    <Badge key={index} variant="secondary">{objective}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-medium">Sports Pratiqués</h3>
                <div className="flex flex-wrap gap-2">
                  {(user.sports as string[] || []).map((sport, index) => (
                    <Badge key={index} variant="outline">{sport}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du compte</CardTitle>
              <CardDescription>
                Modifiez vos informations personnelles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    defaultValue={user.firstName as string}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    defaultValue={user.lastName as string}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user.email as string}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Parlez un peu de vous..." defaultValue={user.description as string} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objectifs et Sports</CardTitle>
              <CardDescription>Sélectionnez jusqu&apos;à 3 objectifs et 3 sports.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Mes objectifs</Label>
                <div className="space-y-2 rounded-md border p-4">
                  {ALL_OBJECTIVES.map((objective) => (
                    <div key={objective} className="flex items-center space-x-2">
                      <Checkbox
                        id={`objective-${objective}`}
                        checked={selectedObjectives.includes(objective)}
                        disabled={!selectedObjectives.includes(objective) && selectedObjectives.length >= 3}
                        onCheckedChange={(checked) => {
                          setSelectedObjectives(prev => 
                            checked 
                              ? [...prev, objective] 
                              : prev.filter(item => item !== objective)
                          );
                        }}
                      />
                      <Label htmlFor={`objective-${objective}`} className="font-normal">{objective}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mes sports</Label>
                <div className="space-y-2 rounded-md border p-4">
                  {ALL_SPORTS.map((sport) => (
                    <div key={sport} className="flex items-center space-x-2">
                      <Checkbox
                        id={`sport-${sport}`}
                        checked={selectedSports.includes(sport)}
                        disabled={!selectedSports.includes(sport) && selectedSports.length >= 3}
                        onCheckedChange={(checked) => {
                          setSelectedSports(prev => 
                            checked 
                              ? [...prev, sport] 
                              : prev.filter(item => item !== sport)
                          );
                        }}
                      />
                      <Label htmlFor={`sport-${sport}`} className="font-normal">{sport}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Gérez vos préférences de notification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications" className="grow">
                  Notifications par email
                </Label>
                <Checkbox id="emailNotifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications" className="grow">
                  Notifications push
                </Label>
                <Checkbox id="pushNotifications" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Gérez les paramètres de sécurité de votre compte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">Changer le mot de passe</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="size-5" />
                Actions
              </CardTitle>
              <CardDescription>
                Enregistrez vos modifications ou déconnectez-vous.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <LogOut className="size-4" />
                      Se déconnecter
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr de vouloir vous déconnecter ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action mettra fin à votre session actuelle. Vous devrez vous reconnecter pour accéder à nouveau à votre compte.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => console.log("Déconnexion confirmée")}>
                        Confirmer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button>Enregistrer les modifications</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
