'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { BarChartBig, Search, LayoutGrid, Map, Users, Lightbulb, Spline } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
}

const navItems: NavItem[] = [
  { href: '/market-analyzer', label: 'Market Analyzer', icon: Search, tooltip: 'AI Market Analysis' },
  { href: '/strategy-canvas', label: 'Strategy Canvas', icon: Spline, tooltip: 'Visualize Value Curves' },
  { href: '/errc-grid', label: 'ERRC Grid', icon: LayoutGrid, tooltip: 'Four Actions Framework' },
  { href: '/buyer-utility-map', label: 'Buyer Utility Map', icon: Map, tooltip: 'Map Buyer Experience' },
  { href: '/pms-map', label: 'PMS Map', icon: Users, tooltip: 'Pioneer-Migrator-Settler' },
  { href: '/value-innovation-canvas', label: 'Value Innovation', icon: Lightbulb, tooltip: 'Design New Value' },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="p-2">
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
              tooltip={{ children: item.tooltip, className: 'capitalize' }}
            >
              <a>
                <item.icon />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
