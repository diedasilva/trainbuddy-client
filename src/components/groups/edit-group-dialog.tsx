"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Save, 
  Trash2, 
  X, 
  Settings, 
  Shield,
  Lock,
  Globe
} from "lucide-react";

import { Group, GroupFormData } from "./types";

interface EditGroupDialogProps {
  group: Group;
  onSaveChanges: (updatedGroup: Group) => void;
  onDeleteGroup: (groupId: number) => void;
  onClose: () => void;
}

export default function EditGroupDialog({
  group,
  onSaveChanges,
  onDeleteGroup,
  onClose
}: EditGroupDialogProps) {
  const [formData, setFormData] = useState<GroupFormData>({
    name: group.name,
    description: group.description,
    status: group.status,
    category: group.category,
    allowMemberInvites: group.settings.allowMemberInvites,
    requireApproval: group.settings.requireApproval,
    maxMembers: group.settings.maxMembers,
    autoArchive: group.settings.autoArchive
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof GroupFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Le nom du groupe est requis");
      return;
    }

    setIsLoading(true);
    try {
      const updatedGroup: Group = {
        ...group,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        category: formData.category,
        settings: {
          allowMemberInvites: formData.allowMemberInvites,
          requireApproval: formData.requireApproval,
          maxMembers: formData.maxMembers,
          autoArchive: formData.autoArchive
        },
        updatedAt: new Date().toISOString()
      };

      onSaveChanges(updatedGroup);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde du groupe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDeleteGroup(group.id);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du groupe");
    } finally {
      setIsLoading(false);
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

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="size-5" />
              Modifier le groupe
            </DialogTitle>
            <DialogDescription>
              Modifiez les paramètres de votre groupe &quot;{group.name}&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Informations de base</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nom du groupe *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nom du groupe"
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Décrivez votre groupe..."
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-slate-500">
                  {formData.description.length}/500 caractères
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Running">Running</option>
                    <option value="Strength">Strength</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Cycling">Cycling</option>
                    <option value="Swimming">Swimming</option>
                    <option value="CrossFit">CrossFit</option>
                    <option value="Pilates">Pilates</option>
                    <option value="Other">Autre</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value as 'public' | 'private' | 'invite-only')}
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
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Paramètres</h3>
              
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

                <div className="space-y-2">
                  <Label htmlFor="maxMembers">Nombre maximum de membres</Label>
                  <Input
                    id="maxMembers"
                    type="number"
                    value={formData.maxMembers}
                    onChange={(e) => handleInputChange("maxMembers", parseInt(e.target.value) || 0)}
                    min="1"
                    max="1000"
                    className="w-32"
                  />
                  <p className="text-xs text-slate-500">
                    Actuellement: {group.totalMembers} membres
                  </p>
                </div>
              </div>
            </div>

            {/* Group Statistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Statistiques</h3>
              
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{group.totalMembers}</div>
                  <div className="text-xs text-slate-600">Membres</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{group.activeMembers}</div>
                  <div className="text-xs text-slate-600">Actifs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{group.workoutCount}</div>
                  <div className="text-xs text-slate-600">Séances</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{group.stats.completionRate}%</div>
                  <div className="text-xs text-slate-600">Taux de réussite</div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <div className="flex flex-1 justify-start">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="gap-2"
                    disabled={isLoading}
                  >
                    <Trash2 className="size-4" />
                    Supprimer le groupe
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer le groupe</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer le groupe &quot;{group.name}&quot; ? 
                      Cette action est irréversible et supprimera définitivement le groupe 
                      ainsi que toutes ses données.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Suppression..." : "Supprimer définitivement"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
                className="gap-2"
              >
                <X className="size-4" />
                Annuler
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isLoading || !formData.name.trim()}
                className="gap-2"
              >
                <Save className="size-4" />
                {isLoading ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
