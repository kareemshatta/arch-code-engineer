import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Fetch about content
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let content = await prisma.aboutContent.findFirst();
    
    if (!content) {
      content = await prisma.aboutContent.create({
        data: {
          philosophyTitle: 'Our Philosophy',
          philosophyText: 'Architecture is more than buildings.',
          visionTitle: 'Our Vision',
          visionText: 'To lead in architectural innovation.',
          missionTitle: 'Our Mission',
          missionText: 'Delivering exceptional solutions.',
        },
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// PUT - Update about content
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    let content = await prisma.aboutContent.findFirst();

    if (content) {
      content = await prisma.aboutContent.update({
        where: { id: content.id },
        data: body,
      });
    } else {
      content = await prisma.aboutContent.create({
        data: body,
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

