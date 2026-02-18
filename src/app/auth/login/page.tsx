"use client";
import SignInForm from "@/components/forms/signInForm";

export default function SignIn() {
  return (
    <div className="relative">
      <div
        className="absolute w-full h-full top-0 left-0 z-10 pointer-events-none"
        style={{
          backgroundColor: "#e5e5f7",
          opacity: "0.6",
          // backgroundImage:
          //   "repeating-radial-gradient( circle at 0 0, transparent 0, #e5e5f7 10px ), repeating-linear-gradient( #00000055, #000000 )",
        }}
      ></div>
      <div className="p-0 h-screen flex items-center justify-center w-full max-w-lg mx-auto z-50 ">
        <div className="max-w-lg rounded-2xl bg-[#212121] border borde-gray-400 z-50">
          <div className=" z-50">
            <div className="p-8 text-white flex flex-col justify-between min-w-md">
              <div className="flex justify-center items-center flex-col mb-6">
                <div className="text-2xl font-bold">Sign In</div>
                <p className="text-white mt-2">
                  Sign in to your account to continue
                </p>
              </div>

              <div className="py-3">
                <SignInForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
