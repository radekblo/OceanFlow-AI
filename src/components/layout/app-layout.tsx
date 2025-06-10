import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarTrigger, SidebarContent } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Waves } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4 flex items-center gap-2 border-b border-sidebar-border">
          <Waves className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-headline font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">OceanFlow AI</h1>
          <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:hidden" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background">
        <div className="p-4 md:p-6 lg:p-8">
         {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
