import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { prisma } from "@/lib/prisma";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BarChart3 
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = (session.user as any).role === "ADMIN";

  // Fetch stats based on role
  const totalTasks = await prisma.task.count({
    where: isAdmin ? {} : { assigneeId: (session.user as any).id }
  });

  const completedTasks = await prisma.task.count({
    where: { 
      ...(isAdmin ? {} : { assigneeId: (session.user as any).id }),
      status: "DONE"
    }
  });

  const totalProjects = await prisma.project.count({
    where: isAdmin ? {} : { members: { some: { userId: (session.user as any).id } } }
  });

  const pendingTasks = totalTasks - completedTasks;

  const stats = [
    { label: isAdmin ? "All Tasks" : "My Tasks", value: totalTasks, icon: BarChart3, color: "var(--primary)" },
    { label: "Completed", value: completedTasks, icon: CheckCircle2, color: "var(--success)" },
    { label: "Pending", value: pendingTasks, icon: Clock, color: "#f1c40f" },
    { label: isAdmin ? "Total Projects" : "Assigned Projects", value: totalProjects, icon: AlertCircle, color: "var(--error)" },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Welcome back, {session.user?.name}!
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            Here's what's happening with your projects today.
          </p>
        </header>

        <section className="grid" style={{ 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {stats.map((stat, i) => (
            <div key={i} className="card flex items-center gap-4">
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: `rgba(${stat.color === 'var(--primary)' ? '88, 166, 255' : stat.color === 'var(--success)' ? '35, 134, 54' : '218, 54, 51'}, 0.1)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color
              }}>
                <stat.icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{stat.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Activity</h2>
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>No recent activity found. Start by creating a project!</p>
          </div>
        </section>
      </main>
    </div>
  );
}
