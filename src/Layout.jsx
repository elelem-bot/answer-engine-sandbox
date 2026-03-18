import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { 
  LayoutDashboard, 
  FileEdit, 
  LineChart,
  MessageSquare,
  Menu,
  LogOut,
  Search,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Bell,
  Folder,
  Check,
  User,
  HelpCircle
} from "lucide-react";
import { GuidanceProvider, useGuidance } from "@/lib/GuidanceContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const platformPages = ["AnswerEngine", "Prompts", "AnswerEngineering", "AnswerVisibility", "Analytics", "Tracking", "PromptResearch"];

// Mock projects — in a real app these would come from the Company entity
const PROJECTS = ["PlayStation", "Acme Corp", "Demo Project"];

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [answerEngineExpanded, setAnswerEngineExpanded] = React.useState(false);
  const [answerVisibilityExpanded, setAnswerVisibilityExpanded] = React.useState(false);
  const [currentProject, setCurrentProject] = React.useState(PROJECTS[0]);
  const [user, setUser] = React.useState(null);
  const [companies, setCompanies] = React.useState([]);
  const [currentCompany, setCurrentCompany] = React.useState(null);

  const showPlatformNav = platformPages.includes(currentPageName);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [me, companyList] = await Promise.all([
          base44.auth.me(),
          base44.entities.Company.list()
        ]);
        setUser(me);
        setCompanies(companyList);
        if (companyList.length > 0) setCurrentCompany(companyList[0]);
      } catch (e) {
        // ignore
      }
    };
    if (showPlatformNav) loadData();
  }, [showPlatformNav]);

  const navItems = [
    { name: "AnswerEngine", label: "Answer Engine", icon: Search, hasChildren: true, children: [
      { name: "Analytics", label: "Analytics", icon: BarChart3 }
    ]},
    { name: "AnswerEngineering", label: "Answer Engineering", icon: FileEdit },
    { name: "AnswerVisibility", label: "Answer Visibility", icon: LayoutDashboard, hasChildren: true, children: [
      { name: "Tracking", label: "Tracking", icon: LineChart },
      { name: "PromptResearch", label: "Prompt Research", icon: Search }
    ]},
    { name: "Prompts", label: "Prompts", icon: MessageSquare },
  ];

  if (!showPlatformNav) {
    return <>{children}</>;
  }

  const NavLink = ({ item, mobile = false }) => {
    const isActive = currentPageName === item.name;
    const hasActiveChild = item.children?.some(c => c.name === currentPageName);
    const expanded = item.name === "AnswerEngine" ? answerEngineExpanded : answerVisibilityExpanded;

    const baseClass = `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm`;
    const activeClass = "nav-active border";
    const inactiveClass = "text-gray-600 hover:text-gray-900 hover:bg-gray-100";

    if (item.hasChildren) {
      return (
        <div>
          <Link
            to={createPageUrl(item.name)}
            onClick={() => {
              if (item.name === "AnswerEngine") setAnswerEngineExpanded(!answerEngineExpanded);
              else setAnswerVisibilityExpanded(!answerVisibilityExpanded);
            }}
            className={`${baseClass} ${isActive || hasActiveChild ? activeClass : inactiveClass}`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium flex-1">{item.label}</span>
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </Link>
          {expanded && item.children && (
            <div className="ml-4 mt-0.5 space-y-0.5">
              {item.children.map(child => (
                <Link
                  key={child.name}
                  to={createPageUrl(child.name)}
                  onClick={() => mobile && setMobileOpen(false)}
                  className={`${baseClass} ${currentPageName === child.name ? activeClass : inactiveClass}`}
                >
                  <child.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{child.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to={createPageUrl(item.name)}
        onClick={() => mobile && setMobileOpen(false)}
        className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  };

  const SidebarContent = ({ mobile = false }) => (
    <>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto pt-3">
        {navItems.map(item => <NavLink key={item.name} item={item} mobile={mobile} />)}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <style>{`
        .nav-active {
          background: linear-gradient(to right, rgba(45,198,254,0.12), rgba(129,251,239,0.12)) !important;
          color: #082D35 !important;
          border-color: rgba(45,198,254,0.35) !important;
          font-weight: 600 !important;
        }
      `}</style>

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
        {/* Left: logo (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-3 w-56 flex-shrink-0">
          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 text-gray-500">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-white border-gray-200">
              <SidebarContent mobile />
            </SheetContent>
          </Sheet>
          {/* Desktop: just spacing so content aligns with sidebar */}
          <Link to={createPageUrl("Home")} className="hidden lg:block">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6943f2bf67610e14801b112b/de87d19e0_elelem2025logoPrimary.png"
              alt="elelem"
              className="h-6"
            />
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: project switcher + notifications + user */}
        <div className="flex items-center gap-2">
          <GuidanceToggle />

          {/* Project Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 gap-2 text-sm text-gray-700 hover:bg-gray-100 px-3">
                <Folder className="w-4 h-4 text-gray-400" />
                <span>{currentCompany?.name || currentProject}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {(companies.length > 0 ? companies : PROJECTS.map(p => ({ id: p, name: p }))).map(c => (
                <DropdownMenuItem
                  key={c.id}
                  onClick={() => { setCurrentCompany(c); setCurrentProject(c.name); }}
                  className="flex items-center gap-2"
                >
                  <Folder className="w-4 h-4 text-gray-400" />
                  <span className="flex-1">{c.name}</span>
                  {(currentCompany?.id === c.id || currentProject === c.name) && (
                    <Check className="w-3.5 h-3.5 text-[#2DC6FE]" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(createPageUrl("Setup"))} className="text-[#2DC6FE]">
                + New Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-gray-100 relative">
            <Bell className="w-4 h-4" />
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 gap-2 text-sm text-gray-700 hover:bg-gray-100 px-2">
                <div className="w-6 h-6 rounded-full bg-[#082D35] flex items-center justify-center text-white text-xs font-semibold">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                </div>
                <span className="hidden sm:block">{user?.full_name || "Account"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user && (
                <>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => base44.auth.logout()} className="text-gray-700">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 pt-12">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-56 border-r border-gray-200 bg-white flex-col fixed top-12 bottom-0 left-0 z-40">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-56 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}