"use client";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import type { AxiosError } from "axios";
import Link from "next/link";

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
  //     {
  //     register,
  //     handleSubmit,
  //     formState: { errors, isSubmitting },
  //     setError,
  //   }
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
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      form.setError("root", {
        message: err.response?.data?.error || "Something went wrong",
      });
    }
  };

  return (
    <Card className="w-full sm:max-w-md mt-5 mb-5">
      <CardHeader className="">
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
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter a secure password"
                  />
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
          <FieldError className="ml-7" errors={[form.formState.errors.root]} />
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
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="register-form" className="cursor-pointer">
            Register
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default Register;
