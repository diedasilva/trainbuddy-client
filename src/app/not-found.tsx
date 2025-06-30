import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, User, Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-xl text-slate-700 mb-6">Oups ! Page non trouvée.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Retour à l&apos;accueil
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            Mon profil
          </Button>
        </Link>
        <Link href="/auth">
          <Button variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            Authentification
          </Button>
        </Link>
      </div>
    </div>
  );
}
