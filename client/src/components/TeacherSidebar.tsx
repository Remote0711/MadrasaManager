import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { tr } from "@/lib/tr";
import { Users, CheckSquare, TrendingUp, Menu, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface TeacherSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const sidebarItems = [
  {
    name: tr.dashboard,
    href: '/dashboard/teacher',
    icon: Home,
  },
  {
    name: tr.myStudents,
    href: '/dashboard/teacher/students',
    icon: Users,
  },
  {
    name: tr.attendance,
    href: '/dashboard/teacher/attendance',
    icon: CheckSquare,
  },
  {
    name: tr.progress,
    href: '/dashboard/teacher/progress',
    icon: TrendingUp,
  },
];

function SidebarContent({ onLinkClick, isCollapsed, onToggleCollapse }: { 
  onLinkClick?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [location] = useLocation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
        <Link href="/dashboard/teacher" className="flex items-center gap-2 font-semibold min-w-0">
          <div className="h-6 w-6 bg-primary rounded flex items-center justify-center flex-shrink-0">
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          {!isCollapsed && <span className="truncate">{tr.schoolName}</span>}
        </Link>
        {onToggleCollapse && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleCollapse}
            className="hidden lg:flex h-8 w-8 p-0"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function TeacherSidebar({ className, isCollapsed, onToggleCollapse }: TeacherSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SidebarContent onLinkClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={`hidden border-r bg-muted/40 md:block ${className} ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
        <SidebarContent isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />
      </div>
    </>
  );
}