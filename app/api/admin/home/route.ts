import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Fetch home content
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let content = await prisma.homeContent.findFirst();
    
    if (!content) {
      content = await prisma.homeContent.create({
        data: {
          heroTitle: 'Arch Code Engineer',
          heroSubtitle: 'Where Architecture Meets Innovation',
          introTitle: 'Crafting Exceptional Spaces',
          introText: 'We create spaces that inspire and endure.',
        },
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching home content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// PUT - Update home content
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    let content = await prisma.homeContent.findFirst();

    if (content) {
      content = await prisma.homeContent.update({
        where: { id: content.id },
        data: body,
      });
    } else {
      content = await prisma.homeContent.create({
        data: body,
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating home content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

