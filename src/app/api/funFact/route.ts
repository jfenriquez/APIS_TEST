"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: /api/funFact?text=space&category=Science&page=1&limit=20
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);

  const text = searchParams.get("text");
  const category = searchParams.get("category");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const total = await prisma.funFact.count({
    where: {
      ...(text ? { text: { contains: text, mode: "insensitive" } } : {}),
      ...(category
        ? { category: { name: { contains: category, mode: "insensitive" } } }
        : {}),
    },
  });

  const funFacts = await prisma.funFact.findMany({
    where: {
      ...(text ? { text: { contains: text, mode: "insensitive" } } : {}),
      ...(category
        ? { category: { name: { contains: category, mode: "insensitive" } } }
        : {}),
    },
    include: { category: true },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const totalPages = Math.ceil(total / limit);

  // reconstruimos la URL base sin page/limit
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
    data: funFacts,
  });
}
