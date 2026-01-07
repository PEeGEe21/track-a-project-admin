"use client";
import SignInForm from "@/components/forms/signInForm";

export default function SignIn() {
  return (
    <>
      <div className="max-w-lg mx-auto rounded-2xl bg-[#171717] p-0 my-5">
        <div className="grid grid-cols-1 h-full">
          <div className="p-8 text-white flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold">Sign In</div>
              </div>
            </div>

            <div className="py-3">
              <SignInForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
