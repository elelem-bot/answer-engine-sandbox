import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Analytics() {
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('elelem-theme') || 'dark';
  });

  React.useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('elelem-theme') || 'dark');
    };
    window.addEventListener('storage', handleThemeChange);
    const interval = setInterval(handleThemeChange, 100);
    return () => {
      window.removeEventListener('storage', handleThemeChange);
      clearInterval(interval);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen p-6 lg:p-8 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>View insights and analytics</p>
        </div>

        <Card className={isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
              Analytics features will be available here soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}