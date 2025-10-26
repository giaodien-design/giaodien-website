import { SignupForm } from "@/components/signup-form";
import { AuthHeader } from "@/components/AuthHeader";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gd-dark flex flex-col md:flex-row">
      {/* Auth Header (Logo + Language Switcher) */}
      <div className="md:w-1/2">
        <AuthHeader />
      </div>

      {/* Signup Form */}
      <div className="flex-1 md:w-1/2 border-b border-gd-cream/[0.12]">
        <SignupForm />
      </div>
    </div>
  );
}
