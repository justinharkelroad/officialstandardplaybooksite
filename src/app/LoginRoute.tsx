import { MemberAuthProvider } from "@/app/lib/auth";
import Login from "@/app/pages/Login";

export default function LoginRoute() {
  return (
    <MemberAuthProvider>
      <Login />
    </MemberAuthProvider>
  );
}
