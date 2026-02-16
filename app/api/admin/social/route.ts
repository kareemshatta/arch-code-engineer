import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  icon: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

// GET - Fetch all social links
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const socialLinks = await prisma.socialLink.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error('Error fetching social links:', error);
    return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 });
  }
}

// POST - Create a new social link
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = socialLinkSchema.parse(body);

    // Get the highest order number
    const lastLink = await prisma.socialLink.findFirst({
      orderBy: { order: 'desc' },
    });

    const socialLink = await prisma.socialLink.create({
      data: {
        ...data,
        order: data.order ?? (lastLink?.order ?? 0) + 1,
      },
    });

    return NextResponse.json(socialLink, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Error creating social link:', error);
    return NextResponse.json({ error: 'Failed to create social link' }, { status: 500 });
  }
}

