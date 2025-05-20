import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Create a singleton instance of PrismaClient
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Sign in successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Sign in error:', error);
    // Log the specific error for debugging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return NextResponse.json(
      { message: 'Error signing in' },
      { status: 500 }
    );
  } finally {
    // Close Prisma connection
    await prisma.$disconnect();
  }
} 