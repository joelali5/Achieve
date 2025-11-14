import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSiderbar from "./AppSidebar";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ModeToggle } from "@/components/ui/ModeToggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSiderbar />
            <main className="border-2 border-red-500 w-full flex justify-between">
              <SidebarTrigger />
              {children}
              <ModeToggle />
            </main>
          </SidebarProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
