"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: /api/scientists?name=Einstein&field=Physics&page=1&limit=20
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);

  const name = searchParams.get("name");
  const field = searchParams.get("field");

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const total = await prisma.scientist.count({
    where: {
      ...(name && { name: { contains: name, mode: "insensitive" } }),
      ...(field && {
        field: {
          name: { contains: field, mode: "insensitive" },
        },
      }),
    },
  });

  const scientists = await prisma.scientist.findMany({
    where: {
      ...(name && { name: { contains: name, mode: "insensitive" } }),
      ...(field && {
        field: {
          name: { contains: field, mode: "insensitive" },
        },
      }),
    },
    include: {
      field: true,
      discoveries: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { name: "asc" },
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
    data: scientists,
  });
}
