import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const tasks = await prisma.task.findMany({
    where: {
      AND: [
        projectId ? { projectId } : {},
        (session.user as any).role === "ADMIN" 
          ? {} 
          : {
              OR: [
                { assigneeId: (session.user as any).id },
                { project: { ownerId: (session.user as any).id } }
              ]
            }
      ]
    },
    include: {
      assignee: { select: { name: true } },
      project: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, status, priority, projectId, assigneeId } = await req.json();

  if (!title || !projectId) {
    return NextResponse.json({ error: "Title and Project ID are required" }, { status: 400 });
  }

  // RBAC: Only Admin can create tasks
  if ((session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Only admins can create tasks" }, { status: 403 });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || "TODO",
      priority: priority || "MEDIUM",
      projectId,
      assigneeId: assigneeId || (session.user as any).id
    }
  });

  return NextResponse.json(task, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status, priority } = await req.json();

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  // RBAC: Assignee can update status, Admin can update anything
  const isAssignee = task.assigneeId === (session.user as any).id;
  const isAdmin = (session.user as any).role === "ADMIN";

  if (!isAssignee && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized to update this task" }, { status: 403 });
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { status, priority }
  });

  return NextResponse.json(updatedTask);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Task ID is required" }, { status: 400 });

  const task = await prisma.task.findUnique({ 
    where: { id },
    include: { project: true }
  });
  
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  // RBAC: Only Admin or Project Owner can delete tasks
  const isOwner = task.project.ownerId === (session.user as any).id;
  const isAdmin = (session.user as any).role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized to delete this task" }, { status: 403 });
  }

  await prisma.task.delete({ where: { id } });

  return NextResponse.json({ message: "Task deleted successfully" });
}
