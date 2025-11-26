"use client";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import type { AxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";

const regSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

type formFields = z.infer<typeof regSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<formFields>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(regSchema),
  });

  const onSubmit: SubmitHandler<formFields> = async (data) => {
    try {
      await axios.post("/api/register", data);
      router.push("/api/auth/signin");
      router.refresh();
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      console.log(err);
      form.setError("root", {
        message: err.response?.data?.error || "Something went wrong",
      });
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen py-2">
      {form.formState.isSubmitting ? (
        <Card className="w-dvw sm:max-w-md mt-5 mb-5 space-y-13">
          <CardHeader>
            <Skeleton className="h-4 w-30 rounded-xl" />
            <Skeleton className="h-4 w-[250px] rounded-xl" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-30 rounded-xl mb-2" />
            <Skeleton className="h-6 w-full rounded-xl mb-5" />

            <Skeleton className="h-4 w-30 rounded-xl mb-2" />
            <Skeleton className="h-6 w-full rounded-xl" />
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Skeleton className="h-6 w-full rounded-xl" />
            <Skeleton className="h-6 w-full rounded-xl" />
          </CardFooter>
          <div className="flex space-x-2 ml-5">
            <Skeleton className="h-4 w-30 rounded-xl" />
            <Skeleton className="h-4 w-30 rounded-xl" />
          </div>
        </Card>
      ) : (
        <Card className="w-dvw sm:max-w-md mt-5 mb-5 h-3/5">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Enter your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                        placeholder="yourname@example.com"
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
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter a secure password"
                        />
                        <p
                          className="absolute inset-y-0 right-3 text-gray-500 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </p>
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
          <div className="flex space-x-0">
            {form.formState.errors.root && (
              <FieldError
                className="ml-7"
                errors={[form.formState.errors.root]}
              />
            )}{" "}
            {form.formState.errors.root && (
              <Link
                href="/api/auth/signin"
                className="ml-5 text-sm underline text-blue-600"
              >
                Signin here
              </Link>
            )}
          </div>
          <CardFooter className="flex flex-col">
            <Field orientation="horizontal">
              <Button
                type="submit"
                form="register-form"
                className="cursor-pointer w-full"
                disabled={form.formState.isSubmitting}
              >
                Register
              </Button>
            </Field>
            <div className="w-full mt-3 md:text-sm text-xs">
              {form.formState.errors.root && (
                <FieldError
                  className="ml-7"
                  errors={[form.formState.errors.root]}
                />
              )}
              <FieldGroup className="flex flex-row items-center mx-6 sm:mx-0">
                <span>Already a member?</span>
                <Link href="/api/auth/signin" className="text-blue-600">
                  Signin here
                </Link>
              </FieldGroup>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Register;
