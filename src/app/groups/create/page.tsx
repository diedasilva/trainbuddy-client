"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Settings, 
  Shield,
  Globe,
  Lock,
  Plus,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { GroupFormData } from "@/components/groups/types";
import { useGroups } from "@/hooks/useGroups";

export default function CreateGroupPage() {
  const router = useRouter();
  const { createGroup, loading } = useGroups();
  
  const [formData, setFormData] = useState<GroupFormData>({
    name: "",
    description: "",
    status: "public",
    category: "",
    allowMemberInvites: true,
    requireApproval: false,
    maxMembers: 50,
    autoArchive: false
  });

  const [errors, setErrors] = useState<Partial<GroupFormData>>({});

  const handleInputChange = (field: keyof GroupFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<GroupFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom du groupe est requis";
    } else if (formData.name.length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    } else if (formData.description.length < 10) {
      newErrors.description = "La description doit contenir au moins 10 caractères";
    }

    if (!formData.category) {
      newErrors.category = "Veuillez sélectionner une catégorie";
    }

    if (formData.maxMembers < 1) {
      newErrors.maxMembers = "Le nombre maximum de membres doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await createGroup(formData);
    if (success) {
      // Success message or redirect
      router.push("/groups/manage");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "public":
        return <Globe className="size-4" />;
      case "private":
        return <Lock className="size-4" />;
      case "invite-only":
        return <Shield className="size-4" />;
      default:
        return <Globe className="size-4" />;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "public":
        return "Visible par tous, n'importe qui peut rejoindre";
      case "private":
        return "Visible par tous, mais nécessite une invitation";
      case "invite-only":
        return "Caché, seuls les membres invités peuvent voir et rejoindre";
      default:
        return "";
    }
  };

  const categories = [
    { value: "Running", label: "Running", icon: "🏃" },
    { value: "Strength", label: "Strength", icon: "💪" },
    { value: "Yoga", label: "Yoga", icon: "🧘" },
    { value: "Cycling", label: "Cycling", icon: "🚴" },
    { value: "Swimming", label: "Swimming", icon: "🏊" },
    { value: "CrossFit", label: "CrossFit", icon: "🔥" },
    { value: "Pilates", label: "Pilates", icon: "🤸" },
    { value: "Other", label: "Autre", icon: "⚡" }
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/groups">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Créer un nouveau groupe</h1>
          <p className="text-slate-600">Créez votre communauté d'entraînement et connectez-vous avec d'autres passionnés</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5" />
              Informations de base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du groupe *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Morning Runners Club"
                maxLength={50}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
              <p className="text-xs text-slate-500">
                {formData.name.length}/50 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Décrivez votre groupe, ses objectifs et ce que les membres peuvent attendre..."
                rows={4}
                maxLength={500}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
              <p className="text-xs text-slate-500">
                {formData.description.length}/500 caractères
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ${errors.category ? "border-red-500" : ""}`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut du groupe</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value as any)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="public">Public</option>
                  <option value="private">Privé</option>
                  <option value="invite-only">Sur invitation</option>
                </select>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  {getStatusIcon(formData.status)}
                  {getStatusDescription(formData.status)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-5" />
              Paramètres du groupe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowMemberInvites"
                  checked={formData.allowMemberInvites}
                  onCheckedChange={(checked) => 
                    handleInputChange("allowMemberInvites", checked as boolean)
                  }
                />
                <Label htmlFor="allowMemberInvites" className="text-sm">
                  Permettre aux membres d&apos;inviter d&apos;autres personnes
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireApproval"
                  checked={formData.requireApproval}
                  onCheckedChange={(checked) => 
                    handleInputChange("requireApproval", checked as boolean)
                  }
                />
                <Label htmlFor="requireApproval" className="text-sm">
                  Exiger une approbation pour les nouvelles demandes d&apos;adhésion
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoArchive"
                  checked={formData.autoArchive}
                  onCheckedChange={(checked) => 
                    handleInputChange("autoArchive", checked as boolean)
                  }
                />
                <Label htmlFor="autoArchive" className="text-sm">
                  Archiver automatiquement les anciennes activités
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMembers">Nombre maximum de membres</Label>
              <Input
                id="maxMembers"
                type="number"
                value={formData.maxMembers}
                onChange={(e) => handleInputChange("maxMembers", parseInt(e.target.value) || 0)}
                min="1"
                max="1000"
                className={`w-32 ${errors.maxMembers ? "border-red-500" : ""}`}
              />
              {errors.maxMembers && (
                <p className="text-sm text-red-600">{errors.maxMembers}</p>
              )}
              <p className="text-xs text-slate-500">
                Limite le nombre de membres pouvant rejoindre le groupe
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Aperçu du groupe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-slate-50 p-6">
              <div className="mb-4 flex items-center space-x-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-slate-200">
                  <span className="text-lg font-bold text-slate-700">
                    {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : 'G'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {formData.name || "Nom du groupe"}
                  </h3>
                  <div className="mt-1 flex items-center space-x-2">
                    <Badge className={formData.status === "public" ? "bg-green-100 text-green-800" : 
                                     formData.status === "private" ? "bg-red-100 text-red-800" : 
                                     "bg-yellow-100 text-yellow-800"}>
                      {formData.status}
                    </Badge>
                    {formData.category && (
                      <Badge variant="outline">
                        {formData.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="mb-4 text-sm text-slate-600">
                {formData.description || "Description du groupe..."}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="size-4 text-slate-500" />
                  <span>0 membres</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="size-4 text-slate-500" />
                  <span>Max: {formData.maxMembers}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/groups">
            <Button variant="outline" type="button">
              Annuler
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={loading}
            className="gap-2"
          >
            <Save className="size-4" />
            {loading ? "Création..." : "Créer le groupe"}
          </Button>
        </div>
      </form>
    </div>
  );
}
