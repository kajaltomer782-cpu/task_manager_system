"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { Plus, Folder, User, Calendar, Trash2, RotateCw } from "lucide-react";

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.ok ? await res.json() : [];
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: desc }),
    });

    if (res.ok) {
      setName("");
      setDesc("");
      setShowModal(false);
      fetchProjects();
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm("Are you sure? This will delete ALL tasks in this project.")) return;
    
    const res = await fetch(`/api/projects?id=${projectId}`, {
      method: "DELETE",
    });
    if (res.ok) fetchProjects();
  };

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <div className="flex">
      <Sidebar />
      <main style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <header className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Projects</h1>
            <p style={{ color: 'var(--muted)' }}>Manage and track your team projects.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-outline flex items-center gap-2" onClick={() => { setLoading(true); fetchProjects(); }}>
              <RotateCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            {isAdmin && (
              <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
                <Plus size={20} /> Create Project
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <Folder size={48} style={{ color: 'var(--muted)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--muted)' }}>No projects found. {isAdmin ? "Create one to get started!" : "Wait for an admin to assign you."}</p>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {projects.map((project: any) => (
              <div key={project.id} className="card">
                <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{project.name}</h3>
                  <div className="flex gap-2 items-center">
                    <span className="badge badge-todo" style={{ fontSize: '0.7rem' }}>Active</span>
                    {isAdmin && (
                      <button 
                        onClick={() => deleteProject(project.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1.5rem', minHeight: '3rem' }}>
                  {project.description || "No description provided."}
                </p>
                <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
                  <div className="flex items-center gap-2">
                    <User size={14} /> {project.owner.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} /> {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%', margin: 'auto' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Create New Project</h2>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label>Project Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Description (Optional)</label>
                  <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
                </div>
                <div className="flex gap-4" style={{ marginTop: '1rem' }}>
                  <button type="button" className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Project</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
