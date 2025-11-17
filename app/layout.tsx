import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSiderbar from "./AppSidebar";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ModeToggle } from "@/components/ModeToggle";
import Navbar from "@/components/Navbar";
import AuthProvider from "./auth/Provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <AppSiderbar />
              <main className="w-full flex justify-between">
                <SidebarTrigger />
                {children}
                <div className="inline-flex space-x-4 items-center h-fit">
                  <Navbar />
                  <ModeToggle />
                </div>
              </main>
            </SidebarProvider>
          </NextThemesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
