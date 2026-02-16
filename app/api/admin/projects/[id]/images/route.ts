import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch all images for a project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const images = await prisma.projectImage.findMany({
      where: { projectId: params.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add a new image to a project
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url, alt = '' } = body;

    if (!url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Get the highest order number
    const lastImage = await prisma.projectImage.findFirst({
      where: { projectId: params.id },
      orderBy: { order: 'desc' },
    });

    const newOrder = lastImage ? lastImage.order + 1 : 0;

    const image = await prisma.projectImage.create({
      data: {
        projectId: params.id,
        url,
        alt,
        order: newOrder,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Failed to add image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove an image from a project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    await prisma.projectImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Reorder images
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageIds } = body;

    if (!imageIds || !Array.isArray(imageIds)) {
      return NextResponse.json({ error: 'Image IDs array is required' }, { status: 400 });
    }

    // Update order for each image
    for (let i = 0; i < imageIds.length; i++) {
      await prisma.projectImage.update({
        where: { id: imageIds[i] },
        data: { order: i },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reorder images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
