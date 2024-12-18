import "../styles/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/layout/AppSidebar";

export const metadata = {
  title: "TrainBuddy",
  description: "Your training companion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="via-white-900">
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
      </body>
    </html>
  );
}
