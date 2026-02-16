import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Fetch contact info
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let contactInfo = await prisma.contactInfo.findFirst();
    
    if (!contactInfo) {
      contactInfo = await prisma.contactInfo.create({
        data: {
          address: '123 Architecture Avenue',
          city: 'New York',
          country: 'United States',
          postalCode: 'NY 10001',
          phone: '+1 (555) 123-4567',
          email: 'hello@archcodeengineer.com',
          officeHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
        },
      });
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json({ error: 'Failed to fetch contact info' }, { status: 500 });
  }
}

// PUT - Update contact info
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    let contactInfo = await prisma.contactInfo.findFirst();

    if (contactInfo) {
      contactInfo = await prisma.contactInfo.update({
        where: { id: contactInfo.id },
        data: body,
      });
    } else {
      contactInfo = await prisma.contactInfo.create({
        data: body,
      });
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 });
  }
}

