"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: /api/commands?language=...&shortcut=...&page=1&limit=20
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const os = searchParams.get("os");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const total = await prisma.command.count({
    where: {
      os: os ? { name: { contains: os } } : {},
    },
  });

  const commands = await prisma.command.findMany({
    where: {
      os: os ? { name: { contains: os, mode: "insensitive" } } : {},
    },
    include: { os: true },
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalPages = Math.ceil(total / limit);

  // reconstruir URL base sin page/limit
  const baseUrl = new URL(req.url);
  baseUrl.searchParams.delete("page");
  baseUrl.searchParams.delete("limit");

  const prevPage =
    page > 1
      ? `${origin}${baseUrl.pathname}?${baseUrl.searchParams.toString()}&page=${
          page - 1
        }&limit=${limit}`
      : null;

  const nextPage =
    page < totalPages
      ? `${origin}${baseUrl.pathname}?${baseUrl.searchParams.toString()}&page=${
          page + 1
        }&limit=${limit}`
      : null;

  return NextResponse.json({
    page,
    limit,
    total,
    totalPages,
    prevPage,
    nextPage,
    data: commands,
  });
}
