"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Filter,
  Trash2,
  RotateCw
} from "lucide-react";

export default function TasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  
  // Form State
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [users, setUsers] = useState([]);
  const [assigneeId, setAssigneeId] = useState("");

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.ok ? await res.json() : [];
    setTasks(data);
    setLoading(false);
  };

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.ok ? await res.json() : [];
    setProjects(data);
    if (data.length > 0) setProjectId(data[0].id);
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.ok ? await res.json() : [];
    setUsers(data);
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    if ((session?.user as any)?.role === "ADMIN") fetchUsers();
  }, [session]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title, 
        description: desc, 
        projectId, 
        status, 
        priority,
        assigneeId: assigneeId || (session?.user as any)?.id 
      }),
    });

    if (res.ok) {
      setTitle("");
      setDesc("");
      setShowModal(false);
      fetchTasks();
    }
  };

  const updateStatus = async (taskId: string, newStatus: string) => {
    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId, status: newStatus }),
    });
    if (res.ok) fetchTasks();
  };
  const deleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    const res = await fetch(`/api/tasks?id=${taskId}`, {
      method: "DELETE",
    });
    if (res.ok) fetchTasks();
  };

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const getStatusBadge = (s: string) => {
    switch(s) {
      case "DONE": return <span className="badge badge-done">Done</span>;
      case "IN_PROGRESS": return <span className="badge badge-progress">In Progress</span>;
      default: return <span className="badge badge-todo">To Do</span>;
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main style={{ marginLeft: '260px', padding: '2rem', width: '100%' }}>
        <header className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>My Tasks</h1>
            <p style={{ color: 'var(--muted)' }}>Keep track of your responsibilities.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-outline flex items-center gap-2" onClick={() => { setLoading(true); fetchTasks(); }}>
              <RotateCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            {isAdmin && (
              <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
                <Plus size={20} /> New Task
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--muted)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--muted)' }}>No tasks found. Create one to get started!</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--secondary)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '1rem' }}>Task</th>
                  <th style={{ padding: '1rem' }}>Project</th>
                  <th style={{ padding: '1rem' }}>Priority</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task: any) => (
                  <tr key={task.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{task.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{task.description || "No description"}</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{task.project.name}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: task.priority === 'HIGH' ? 'var(--error)' : task.priority === 'MEDIUM' ? '#f1c40f' : 'var(--success)'
                      }}>
                        {task.priority}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{getStatusBadge(task.status)}</td>
                    <td style={{ padding: '1rem' }}>
                      <div className="flex items-center gap-2">
                        <select 
                          style={{ padding: '0.25rem', fontSize: '0.75rem', width: 'auto' }}
                          value={task.status}
                          onChange={(e) => updateStatus(task.id, e.target.value)}
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="DONE">Done</option>
                        </select>
                        {isAdmin && (
                          <button 
                            onClick={() => deleteTask(task.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
                            title="Delete Task"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create Task Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%', margin: 'auto' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label>Task Title</label>
                  <input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Design Landing Page"
                    required 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Description</label>
                  <textarea 
                    value={desc} 
                    onChange={(e) => setDesc(e.target.value)} 
                    rows={3} 
                    placeholder="Describe the task details..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Project</label>
                  {projects.length === 0 ? (
                    <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>
                      No projects available. Please create a project first.
                    </p>
                  ) : (
                    <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
                      <option value="" disabled>Select a project</option>
                      {projects.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2" style={{ flex: 1 }}>
                    <label>Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2" style={{ flex: 1 }}>
                    <label>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                </div>

                {isAdmin && users.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <label>Assign To</label>
                    <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                      <option value="">Myself</option>
                      {users.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-4" style={{ marginTop: '1rem' }}>
                  <button type="button" className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Task</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
