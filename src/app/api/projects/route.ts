import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: (session.user as any).id },
        { members: { some: { userId: (session.user as any).id } } }
      ]
    },
    include: {
      owner: { select: { name: true } },
      _count: { select: { tasks: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // RBAC: Only Admins can create projects
  if ((session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Only admins can create projects" }, { status: 403 });
  }

  const { name, description } = await req.json();

  if (!name) return NextResponse.json({ error: "Project name is required" }, { status: 400 });

  const project = await prisma.project.create({
    data: {
      name,
      description,
      ownerId: (session.user as any).id
    }
  });

  return NextResponse.json(project, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only Admins can delete projects
  if ((session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Only admins can delete projects" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Project ID is required" }, { status: 400 });

  // Delete project (Prisma will handle cascading deletes if configured, or we do it manually)
  await prisma.task.deleteMany({ where: { projectId: id } });
  await prisma.projectMember.deleteMany({ where: { projectId: id } });
  await prisma.project.delete({ where: { id } });

  return NextResponse.json({ message: "Project deleted successfully" });
}
