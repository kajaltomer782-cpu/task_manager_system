"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  LogOut, 
  User as UserIcon,
  PlusCircle,
  Sun,
  Moon
} from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "My Tasks", href: "/tasks", icon: CheckSquare },
  ];

  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <aside className="sidebar glass" style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
      zIndex: 100,
      background: 'var(--sidebar)',
      borderRight: '1px solid var(--border)'
    }}>
      <div className="logo" style={{ 
        fontSize: '1.5rem', 
        fontWeight: 800, 
        marginBottom: '3rem', 
        padding: '0 1rem',
        background: 'linear-gradient(90deg, #58a6ff, #1f6feb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        TaskFlow
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {navItems.map((item) => (
            <li key={item.href} style={{ marginBottom: '0.5rem' }}>
              <Link 
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius)',
                  color: pathname === item.href ? 'var(--primary)' : 'var(--muted)',
                  background: pathname === item.href ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
                  fontWeight: pathname === item.href ? 600 : 400,
                  transition: 'all 0.2s ease'
                }}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="user-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '0.5rem 1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'var(--secondary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '1px solid var(--border)'
          }}>
            <UserIcon size={16} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {session?.user?.name || "User"}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'capitalize' }}>
              {(session?.user as any)?.role || "Member"}
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius)',
          background: 'var(--secondary)',
          marginBottom: '0.5rem',
          position: 'relative'
        }}>
          {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          <select 
            value={theme} 
            onChange={(e) => handleThemeChange(e.target.value as "light" | "dark")}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: 0,
              width: '100%',
              outline: 'none'
            }}
          >
            <option value="dark" style={{ background: 'var(--card)' }}>Dark Mode</option>
            <option value="light" style={{ background: 'var(--card)' }}>Light Mode</option>
          </select>
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            color: 'var(--error)',
            background: 'transparent',
            textAlign: 'left'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};
