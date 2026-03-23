import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserRoundPen } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const ProfileIcon = () => {
  const session = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-9 h-9 cursor-pointer bg-stone-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {session.data?.user.username.charAt(0)}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 p-2">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-2 p-3 border-b">
          <div className="w-12 h-12 bg-stone-700 rounded-full flex items-center justify-center text-white font-semibold">
            {session.data?.user.username.charAt(0)}
          </div>
          <p className="text-sm font-medium">{session.data?.user.username}</p>
          <p className="text-xs text-muted-foreground">
            {session.data?.user.email}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-2 flex flex-col gap-1">
          <Link href="/profile-update" className="flex gap-2 items-center">
            <DropdownMenuItem className="w-full cursor-pointer">
              <UserRoundPen /> Edit Profile
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            className="cursor-pointer text-red-500"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut /> Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileIcon;
