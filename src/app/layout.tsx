import "../styles/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Footer from "@/components/layout/Footer";
import { BackgroundPattern } from "@/components/ui/background-pattern";

export const metadata = {
  title: "TrainBuddy",
  description: "Votre compagnon d'entraînement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <BackgroundPattern
          // Dégradé chaud et subtil pour un look classe et un bon contraste.
          gradientFrom="from-stone-50"
          gradientTo="to-stone-100"

          // On garde le fond lisse.
          showGrid={false}
        >
          <SidebarProvider>
            <div className="flex flex-1">
              <AppSidebar />
              <main className="flex min-h-screen flex-1 flex-col text-slate-900">
                <SidebarTrigger />
                <div className="flex-1">{children}</div>
                <Footer />
              </main>
            </div>
          </SidebarProvider>
        </BackgroundPattern>
      </body>
    </html>
  );
}
