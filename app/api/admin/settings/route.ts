import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Fetch site settings
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: 'Arch Code Engineer',
          slogan: 'Where Architecture Meets Innovation',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT - Update site settings
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { siteName, slogan, logo, favicon, seoTitle, seoDescription, seoKeywords } = body;

    let settings = await prisma.siteSettings.findFirst();

    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          siteName,
          slogan,
          logo,
          favicon,
          seoTitle,
          seoDescription,
          seoKeywords,
        },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          siteName,
          slogan,
          logo,
          favicon,
          seoTitle,
          seoDescription,
          seoKeywords,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

