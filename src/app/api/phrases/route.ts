import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: /api/phrases?author=...&category=...&page=1&limit=20
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const author = searchParams.get("author");
  const category = searchParams.get("category");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const where = {
    ...(author ? { author: { name: { contains: author } } } : {}),
    ...(category ? { category: { name: { contains: category } } } : {}),
  };

  const total = await prisma.phrase.count({ where });

  const phrases = await prisma.phrase.findMany({
    where,
    include: { author: true, category: true },
    skip: (page - 1) * limit,
    take: limit,
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
    data: phrases,
  });
}

// POST: /api/phrases
export async function POST(req: Request) {
  const body = await req.json();
  const phrase = await prisma.phrase.create({
    data: {
      text: body.text,
      authorId: body.authorId,
      categoryId: body.categoryId,
    },
  });
  return NextResponse.json(phrase);
}
