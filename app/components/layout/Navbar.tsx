import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import SignOut from "../auth/SignOut";
import ModeToggle from "../layout/ModeToggle";
import SignInModal from "../auth/SignInModal";
import SignUpModal from "../auth/SignUpModal";
import { Button } from "@/components/ui/button";

const Navbar = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const username = session?.user.username;

  return (
    <div
      className="flex items-center justify-between gap-6 px-8 py-5"
      data-theme="light"
    >
      <Link href="/">HOME</Link>
      <div className="flex gap-6 items-center">
        <ModeToggle />
        {username ? (
          <div className="flex gap-6 items-center">
            <p>Welcome {username}</p>
            <Link href="/settings">
              <Button variant="outline">Settings</Button>
            </Link>
            {/* {role === "admin" && <Link href="/admin">ADMIN</Link>} */}
            <SignOut />
          </div>
        ) : (
          <div className="flex gap-4">
            <SignInModal />
            <SignUpModal />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
