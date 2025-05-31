import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Validation schema for user updates
const userUpdateSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  role: z.enum(["ADMIN", "STUDENT", "EVENT_ORGANIZER"]).optional(),
  department: z.string().optional(),
  year: z.number().optional(),
});

// Validation schema for user creation
const userCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  role: z.enum(["ADMIN", "STUDENT", "EVENT_ORGANIZER"]),
  department: z.string().optional(),
  year: z.number().optional(),
});

// Add type definitions for statistics
interface DepartmentStat {
  department: string;
  count: bigint;
}

interface RoleStat {
  role: string;
  count: bigint;
}

// GET /api/admin/users - Get users with pagination, filtering, and search
export async function GET(request: Request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || undefined;
    const department = searchParams.get("department") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && role !== "") {
      where.role = role;
    }

    if (department && department !== "") {
      where.department = department;
    }

    // Validate sortBy field to prevent injection
    const allowedSortFields = ["createdAt", "name", "email", "role", "department"];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    try {
      // Fetch users with pagination
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          orderBy: { [validSortBy]: sortOrder },
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
            year: true,
            image: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                eventsCreated: true,
                registrations: true,
              },
            },
          },
        }),
        prisma.user.count({ where }),
      ]);

      // Get all users for statistics (without pagination)
      const allUsers = await prisma.user.findMany({
        select: {
          role: true,
          department: true,
          emailVerified: true,
          createdAt: true,
        },
      });

      // Calculate statistics
      const departmentCounts = new Map();
      const roleCounts = new Map();

      allUsers.forEach(user => {
        // Count departments
        if (user.department) {
          const count = departmentCounts.get(user.department) || 0;
          departmentCounts.set(user.department, count + 1);
        }

        // Count roles
        const roleCount = roleCounts.get(user.role) || 0;
        roleCounts.set(user.role, roleCount + 1);
      });

      // Convert to arrays
      const departmentStats = Array.from(departmentCounts.entries()).map(([department, count]) => ({
        department,
        _count: count,
      }));

      const roleStats = Array.from(roleCounts.entries()).map(([role, count]) => ({
        role,
        _count: count,
      }));

      return NextResponse.json({
        users,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        departmentStats,
        roleStats,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in users API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: Request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validationResult = userCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { password, ...userData } = validationResult.data;

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        role: userData.role,
        department: userData.department,
        year: userData.year,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        year: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      user: newUser,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users - Update user
export async function PATCH(request: Request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate update data
    const validationResult = userUpdateSchema.safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid update data", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: validationResult.data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        year: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users - Delete user
export async function DELETE(request: Request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent deletion of admin users
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Cannot delete admin users" },
        { status: 403 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 