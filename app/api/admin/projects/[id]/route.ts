import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().optional(),
  description: z.string().min(1).optional(),
  fullDescription: z.string().optional(),
  location: z.string().optional(),
  year: z.string().optional(),
  client: z.string().optional(),
  area: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

interface RouteParams {
  params: { id: string };
}

// GET - Fetch single project
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT - Update project
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = projectSchema.parse(body);

    // If slug is being changed, check for duplicates
    if (data.slug) {
      const existingProject = await prisma.project.findFirst({
        where: {
          slug: data.slug,
          NOT: { id: params.id },
        },
      });

      if (existingProject) {
        return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 400 });
      }
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data,
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE - Delete project (and its images)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Delete all project images first (cascade should handle this, but being explicit)
    await prisma.projectImage.deleteMany({
      where: { projectId: params.id },
    });

    // Delete the project
    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

