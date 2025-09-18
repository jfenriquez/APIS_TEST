"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const os = searchParams.get("os")?.replace(/['"]+/g, "");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const shortcut = await prisma.shortcut.findMany({
    where: {
      os: os ? { name: { contains: os, mode: "insensitive" } } : {},
    },
    include: { os: true },
    skip: (page - 1) * limit,
    take: limit,
  });
  const total = await prisma.shortcut.count({
    where: {
      os: os ? { name: { contains: os, mode: "insensitive" } } : {},
    },
  });
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    page,
    limit,
    total,
    totalPages,
    data: shortcut,
  });
}
