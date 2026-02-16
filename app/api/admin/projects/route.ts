import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { generateSlug } from '@/lib/utils';

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
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

// GET - Fetch all projects
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST - Create a new project
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = projectSchema.parse(body);

    // Generate slug from title if not provided
    const slug = data.slug || generateSlug(data.title);

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 400 });
    }

    // Get the highest order number
    const lastProject = await prisma.project.findFirst({
      orderBy: { order: 'desc' },
    });

    const project = await prisma.project.create({
      data: {
        ...data,
        slug,
        order: data.order ?? (lastProject?.order ?? 0) + 1,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

