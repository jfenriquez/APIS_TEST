// src/app/api/openapi/route.ts
import { NextResponse } from "next/server";
import { openapi } from "@/lib/openapi";

export const dynamic = "force-static"; // es un JSON estático

export async function GET() {
  return NextResponse.json(openapi);
}
