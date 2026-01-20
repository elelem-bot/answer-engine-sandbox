import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  FileEdit, 
  FilePlus, 
  LineChart,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Search,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const platformPages = ["AnswerEngine", "Prompts", "AnswerEngineering", "AnswerVisibility", "Tracking"];

  export default function Layout({ children, currentPageName }) {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [theme, setTheme] = React.useState(() => {
      return localStorage.getItem('elelem-theme') || 'dark';
    });

    React.useEffect(() => {
      localStorage.setItem('elelem-theme', theme);
    }, [theme]);

    const showPlatformNav = platformPages.includes(currentPageName);

    const navItems = [
      { name: "AnswerEngine", label: "Answer Engine", icon: Search },
      { name: "Prompts", label: "Prompts", icon: MessageSquare },
      { name: "AnswerEngineering", label: "Answer Engineering", icon: FileEdit },
      { name: "AnswerVisibility", label: "Answer Visibility", icon: LayoutDashboard },
      { name: "Tracking", label: "Tracking", icon: LineChart },
    ];

  if (!showPlatformNav) {
    return <>{children}</>;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex w-64 border-r flex-col ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className={`p-6 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
          <Link to={createPageUrl("Home")} className="flex items-center">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6943f2bf67610e14801b112b/de87d19e0_elelem2025logoPrimary.png"
              alt="elelem"
              className={`h-8 ${isDark ? 'brightness-0 invert' : ''}`}
            />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPageName === item.name;
            return (
              <Link
                key={item.name}
                to={createPageUrl(item.name)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-600 border border-teal-500/30"
                    : isDark 
                      ? "text-slate-400 hover:text-white hover:bg-slate-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'} space-y-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-yellow-500'}`} />
              <Label className={`text-sm cursor-pointer ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                {theme === 'dark' ? 'Dark' : 'Light'}
              </Label>
            </div>
            <Switch 
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
          <Button variant="ghost" className={`w-full justify-start ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-gray-200'}`}>
        <div className="flex items-center justify-between p-4">
          <Link to={createPageUrl("Home")} className="flex items-center">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6943f2bf67610e14801b112b/de87d19e0_elelem2025logoPrimary.png"
              alt="elelem"
              className={`h-7 ${isDark ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={isDark ? 'text-white' : 'text-gray-900'}>
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={`p-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <div className={`p-6 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6943f2bf67610e14801b112b/de87d19e0_elelem2025logoPrimary.png"
                    alt="elelem"
                    className={`h-8 ${isDark ? 'brightness-0 invert' : ''}`}
                  />
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = currentPageName === item.name;
                  return (
                    <Link
                      key={item.name}
                      to={createPageUrl(item.name)}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-600 border border-teal-500/30"
                          : isDark
                            ? "text-slate-400 hover:text-white hover:bg-slate-800"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'} space-y-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-yellow-500'}`} />
                    <Label className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      {theme === 'dark' ? 'Dark' : 'Light'}
                    </Label>
                  </div>
                  <Switch 
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:pt-0 pt-16">
        {children}
      </main>
    </div>
  );
}