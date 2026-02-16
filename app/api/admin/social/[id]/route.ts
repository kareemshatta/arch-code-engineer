import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const socialLinkSchema = z.object({
  platform: z.string().min(1).optional(),
  url: z.string().url().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

interface RouteParams {
  params: { id: string };
}

// PUT - Update social link
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = socialLinkSchema.parse(body);

    const socialLink = await prisma.socialLink.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(socialLink);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Error updating social link:', error);
    return NextResponse.json({ error: 'Failed to update social link' }, { status: 500 });
  }
}

// DELETE - Delete social link
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.socialLink.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting social link:', error);
    return NextResponse.json({ error: 'Failed to delete social link' }, { status: 500 });
  }
}

