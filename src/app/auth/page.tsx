"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone,
  Calendar,
  Facebook,
  Twitter,
  Github,
  ArrowRight
} from "lucide-react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenue sur TrainBuddy</h1>
          <p className="text-slate-600">Votre parcours fitness commence ici</p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl border-slate-200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-slate-900">Commencer</CardTitle>
            <CardDescription>Rejoignez des milliers de passionnés de fitness</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 mb-6">
                <TabsTrigger 
                  value="login" 
                  className={`data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm`}
                >
                  Connexion
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className={`data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm`}
                >
                  Inscription
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="login-email" 
                        type="email" 
                        placeholder="Entrez votre email"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="login-password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez votre mot de passe"
                        className="pl-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm">Se souvenir de moi</Label>
                    </div>
                    <Button variant="link" className="text-sm p-0 h-auto">
                      Mot de passe oublié ?
                    </Button>
                  </div>

                  <Button className="w-full gap-2">
                    Se connecter
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Ou continuer avec</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="gap-2">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Github className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="first-name" 
                          placeholder="Jean"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Nom</Label>
                      <Input 
                        id="last-name" 
                        placeholder="Dupont"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="jean.dupont@exemple.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+33 6 12 34 56 78"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Date de naissance</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="birthdate" 
                        type="date"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="register-password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Créez un mot de passe fort"
                        className="pl-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="confirm-password" 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmez votre mot de passe"
                        className="pl-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" className="mt-1" />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        J&apos;accepte les{" "}
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Conditions d&apos;utilisation
                        </Button>{" "}
                        et la{" "}
                        <Button variant="link" className="p-0 h-auto text-sm">
                          Politique de confidentialité
                        </Button>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="newsletter" className="mt-1" />
                      <Label htmlFor="newsletter" className="text-sm">
                        Je souhaite recevoir des conseils fitness et des mises à jour
                      </Label>
                    </div>
                  </div>

                  <Button className="w-full gap-2">
                    Créer un compte
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Ou s&apos;inscrire avec</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="gap-2">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Github className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <User className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Personnalisé</h3>
            <p className="text-sm text-slate-600">Entraînements adaptés à vos objectifs</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Flexible</h3>
            <p className="text-sm text-slate-600">Entraînez-vous à votre rythme</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Lock className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Sécurisé</h3>
            <p className="text-sm text-slate-600">Vos données sont toujours protégées</p>
          </div>
        </div>
      </div>
    </div>
  );
}
