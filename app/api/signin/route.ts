import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = schema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });
  if (!user) {
    return NextResponse.json({
      error: "Invalid email or password",
      status: 401,
    });
  }

  const isPasswordMatch = await bcrypt.compare(
    body.password,
    user.hashedPassword!
  );

  if (!isPasswordMatch) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  return NextResponse.json(user.email, { status: 200 });
}
