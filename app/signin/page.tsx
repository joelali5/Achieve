"use client";

import { FcGoogle } from "react-icons/fc";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

const signInSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

type formFields = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<formFields>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<formFields> = async (data) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      form.setError("root", { message: result.error });
      return;
    }
    window.location.assign("/");
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen py-2">
      <Card className="w-dvw sm:max-w-md mt-5 mb-5">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your details to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <div className="relative w-full">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pr-10"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                      >
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Field
            orientation="horizontal"
            className="flex flex-col justify-center"
          >
            <Button
              type="submit"
              form="signin-form"
              className="cursor-pointer w-full py-6"
              disabled={form.formState.isSubmitting}
            >
              Sign In with Credentials
            </Button>
            <div className="relative flex items-center justify-center my-4 w-auto">
              <Separator className="flex-1 bg-slate-400 h-[1px]" />
              <span className="text-sm text-muted-foreground px-2">Or</span>
              <Separator className="flex-1 text-slate-500 bg-slate-400 h-[1px]" />
            </div>
            <Button
              type="submit"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full py-6 rounded-md cursor-pointer"
            >
              <FcGoogle size={30} className="text-4xl" />
              Sign in with Google
            </Button>
          </Field>
          <div className="mt-4 md:text-sm text-xs w-full">
            {form.formState.errors.root && (
              <FieldError
                className="ml-7"
                errors={[form.formState.errors.root]}
              />
            )}
            <FieldGroup className="flex flex-row items-center mx-6 sm:mx-0">
              <span>Not registered?</span>
              <Link href="/register" className="text-blue-600">
                Create account
              </Link>
            </FieldGroup>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
