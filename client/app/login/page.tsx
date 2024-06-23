import { WaveAnimation } from "@/components/WaveAnimation/WaveAnimation";
import { LoginForm } from "@/features/LoginForm/LoginForm";

export default function Login() {
  return (
    <main
      className="relative text-center text-white"
      style={{
        background: "linear-gradient(60deg, rgba(84, 58, 183, 1) 0%, rgba(0, 172, 193, 1) 100%)",
      }}
    >
      <div className="w-full m-0 p-0 h-[75vh] flex justify-center items-center text-center"></div>
      <div>
        <WaveAnimation />
      </div>
      <div className="fixed top-0 bottom-[8vh] left-0 right-0 flex flex-row items-center justify-center">
        <div
          className="rounded-[1rem] flex-grow-0 flex-shrink-0 w-[26rem] px-8 pt-4 pb-6 bg-white gap-4"
          style={{ outline: "1px solid rgb(200, 200, 200)" }}
        >
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
