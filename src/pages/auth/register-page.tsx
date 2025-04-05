import React from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleLogin } from "@react-oauth/google";

type FormData = {
  name: string;
  email: string;
  password: string;
  agreeTerms: boolean;
};

const schema = yup
  .object({
    name: yup.string().required("Full Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
    agreeTerms: yup
      .boolean()
      .default(false)
      .required("You must agree to the Terms of Service and Privacy Policy")
      .oneOf(
        [true],
        "You must agree to the Terms of Service and Privacy Policy"
      ),
  })
  .required();

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      agreeTerms: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  interface GoogleLoginResponse {
    credential?: string;
    clientId?: string;
    select_by?: string;
  }

  const responseMessage = (response: GoogleLoginResponse) => {
    console.log(response);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Image */}
      <div className="hidden bg-black md:block md:w-1/2">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gradient-to-l from-black to-transparent z-10"></div>
          <div className="absolute inset-0 flex flex-col items-end justify-center p-12 z-20">
            <div className="max-w-md space-y-4 text-right">
              <h2 className="text-3xl font-bold text-white">
                Start Your Reading Journey
              </h2>
              <p className="text-gray-300">
                Join thousands of readers who use our platform to read, analyze,
                and interact with their documents.
              </p>
              <div className="flex justify-end space-x-2">
                <div className="h-1 w-12 rounded-full bg-gray-600"></div>
                <div className="h-1 w-12 rounded-full bg-gray-600"></div>
                <div className="h-1 w-12 rounded-full bg-primary"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center space-y-6 px-4 md:w-1/2 md:px-8 lg:px-12 xl:px-20">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-sm text-gray-500">
            Enter your details to create your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Password must be at least 8 characters long
            </p>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="terms" {...register("agreeTerms")} />
            <Label
              htmlFor="terms"
              className="text-sm font-normal leading-tight"
            >
              I agree to the{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.agreeTerms && (
            <p className="text-red-500 text-xs">{errors.agreeTerms.message}</p>
          )}

          <Button type="submit" className="w-full">
            <UserPlus className="mr-2 h-4 w-4" />
            Create account
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <GoogleLogin onSuccess={responseMessage} />
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
