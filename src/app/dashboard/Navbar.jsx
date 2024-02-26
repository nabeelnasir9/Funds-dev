"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

// import useStore from '@/lib/store'
// import { useLogout } from './mutations'
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function Navbar({ className }) {
  const [role, setRole] = useState("Employee");
  const router = useRouter();
  // const admin = useStore().admin
  const admin = { user_name: "malik" };

  // const logout = useLogout()

  useEffect(() => {
    async function setRoleFunc() {
      let res = await localStorage.getItem("role").toUpperCase();
      setRole(res);
    }
	setRoleFunc()
  }, []);

  const onLogout = async () => {
    // await logout.mutateAsync()
  };

  // useEffect(() => {
  // 	if (logout.isSuccess) {
  // 		router.push('/login')
  // 	}
  // }, [logout.isSuccess])
  return (
    <main className={cn(className)}>
      <div className="mx-auto flex items-center justify-between px-10">
        <h1 className="flex">
          <p>Funds Reimbursement</p>
          {/* <img src='/images/logo-full.png' alt='' className='max-w-[120px] flex-1' /> */}
        </h1>
        <h1>
          <p className="text-[24px] font-semibold">{role} Dashboard</p>
        </h1>
        <nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center">
                <UserCircle2 className="mr-2 h-10 w-10" />
                <span>
                  {admin?.user_name ? admin?.user_name : "no_username"}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer text-black hover:text-balck">
                  <Link href={"/dashboard/profile"} className="flex">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-black hover:text-balck"
                  // onClick={() => logout.mutate()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </main>
  );
}
