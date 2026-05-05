import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  Users, 
  Zap, 
  ArrowRight 
} from "lucide-react";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      {/* Nav */}
      <nav className="glass" style={{ 
        padding: '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          fontSize: '1.5rem', 
          fontWeight: 800,
          background: 'linear-gradient(90deg, #58a6ff, #1f6feb)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          TaskFlow
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="btn-outline">Login</Link>
          <Link href="/signup" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="container flex flex-col items-center" style={{ textAlign: 'center', paddingTop: '8rem' }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 900, 
          marginBottom: '1.5rem', 
          lineHeight: 1.1,
          maxWidth: '800px'
        }}>
          Manage projects and teams <span style={{ color: 'var(--primary)' }}>effortlessly</span>.
        </h1>
        <p style={{ 
          color: 'var(--muted)', 
          fontSize: '1.25rem', 
          marginBottom: '3rem',
          maxWidth: '600px'
        }}>
          The all-in-one platform for role-based task management, project tracking, and team collaboration.
        </p>
        <div className="flex gap-4">
          <Link href="/signup" className="btn-primary flex items-center gap-2" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Start for free <ArrowRight size={20} />
          </Link>
          <Link href="/login" className="btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            View Demo
          </Link>
        </div>

        {/* Features */}
        <section id="features" className="grid" style={{ 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginTop: '8rem',
          width: '100%'
        }}>
          {[
            { title: "Role-Based Access", desc: "Separate permissions for Admins and Members to keep projects secure.", icon: Users, href: "/login" },
            { title: "Task Tracking", desc: "Monitor task status, priority, and deadlines in a beautiful dashboard.", icon: CheckCircle2, href: "/dashboard" },
            { title: "Fast Performance", desc: "Built with Next.js for a lightning-fast and responsive experience.", icon: Zap, href: "#features" },
          ].map((feature, i) => (
            <Link key={i} href={feature.href} className="card-link">
              <div className="card" style={{ textAlign: 'left', height: '100%' }}>
                <div style={{ 
                  color: 'var(--primary)', 
                  marginBottom: '1rem',
                  background: 'rgba(88, 166, 255, 0.1)',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px'
                }}>
                  <feature.icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--muted)' }}>{feature.desc}</p>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <footer style={{ marginTop: 'auto', padding: '4rem 2rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--muted)' }}>
        <p>© 2026 TaskFlow. Built for excellence.</p>
      </footer>
    </div>
  );
}
