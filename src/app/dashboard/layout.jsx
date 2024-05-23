"use client";

import { useState, useEffect, cloneElement } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { http } from "@/lib/config";
import { apiUrls } from "@/lib/apis";
import axios from "axios";
import { Audio, RotatingLines, Oval } from "react-loader-spinner";
import {
  ChevronRight,
  LayoutDashboard,
  Users,
  Hotel,
  Plane,
  Bus,
  User,
  NotepadText,
  UserRoundPlus,
  Database,
  BookUser,
  Utensils,
  BarChartHorizontal,
  Bath,
  Flag,
  View,
  Keyboard,
  DollarSign,
  StickyNoteIcon,
  HomeIcon,
  UsersRound,
  Coins,
  Home, 
  Clock11,
  FileText
} from "lucide-react";
import useStore from "@/lib/store";
import { cn } from "@/lib/utils";
import { CommonAccordion } from "../../components/CommonAccordion";
import { CommonTooltip } from "../../components/CommonTooltip";
import { Navbar } from "./Navbar";

export default function Layout({ children }) {
  const router = useRouter();
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [userStatus, setUserStatus] = useState("");
  const [user, setUser] = useState();

  const [loading, setLoading] = useState(true);
  const store = useStore();
  // useEffect(() => {
  // 	if (!store.admin) {
  // 		const url = window.location.href
  // 		store.setUrl(url.substring(url.indexOf('/dashboard'), url.length))
  // 		// goto root page, so get_me request will be fetched and user will be verified
  // 		return router.push('/')
  // 	}
  // }, [])

  const path = usePathname();
  const [defaultRoutes, setDefaultRoutes] = useState([
    {
      name: "Cash",
      path: "/dashboard/cash",
      icon: <DollarSign />,
    },
    {
      name: "Leaves",
      path: "/dashboard/leaves",
      icon: <Home />,
    },
    {
      name: "Pass out",
      path: "/dashboard/passOut",
      icon: <Clock11 />,
    },
    {
      name: "Invoices",
      path: "/dashboard/invoices",
      icon: <FileText />,
    },
  ]);

  useEffect(() => {
    const checkSuperAdmin = async () => {
      const role = await localStorage.getItem("role");
      if (role === "superAdmin") {
        // Check if "Users" route is already added
        const usersRouteExists = defaultRoutes.some(
          (route) => route.name === "Users"
        );
        if (!usersRouteExists) {
          // Add "Users" route at the beginning of the array
          setDefaultRoutes((prevRoutes) => [
            {
              name: "Users",
              path: "/dashboard/users",
              icon: <UsersRound />,
            },
            ...prevRoutes.filter((route) => route.name !== "Users"), // Remove duplicate "Users" route if exists
          ]);
        }
      }
    };
    checkSuperAdmin();
  }, []);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setLoading(true);
        let userToken = localStorage.getItem("token");

        const bodyData = { token: userToken };
        console.log(userToken, "=============", bodyData);
        let res = await http.post(apiUrls.users.me, bodyData);
        console.log(res, "---------------------------");
        setUserStatus(res?.data?.status);
        setUser(res?.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);

        console.log(error);
      }
    };
    checkUserRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Oval
          visible={true}
          height="80"
          width="80"
          color="lightblue"
          secondaryColor="whitesmoke"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  if (userStatus !== "pending") {
    return (
      <main className="min-h-screen">
        <header className="flex h-[100px] w-full items-center border-b border-gray-300">
          <Navbar className="flex-1" />
        </header>
        <main className="flex min-h-[calc(100vh-100px)]">
          <nav
            className={cn(
              {
                "w-[250px]": sidebarToggle,
                "w-[72px]": !sidebarToggle,
              },
              "overflow-hidden transition-all min-w-[72px] ",
            )}
          >
            <ul
              className="sidebar space-y-2  overflow-y-auto p-3"
              style={{
                maxHeight: "calc(100vh - 100px)",
                minWidth:  "72px",
                overflowX: "hidden",
              }}
            >
              
              {defaultRoutes.map((route, i) => (
                <li key={i + 1}>
                  <Link
                    className={cn(
                      {
                        "bg-gray-100": path === route.path,
                      },
                      "flex cursor-pointer items-center justify-start gap-2 rounded-md p-3 transition-colors  hover:bg-gray-100"
                    )}
                    href={route.path}
                  >
                    <CommonTooltip
                      trigger={cloneElement(route.icon, {
                        className: cn("max-w-[24px] min-w-[24px] flex-1"),
                      })}
                    >
                      {route.name}
                    </CommonTooltip>
                    
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <main className="flex flex-1 border-l border-gray-300 p-4">
            {children}
          </main>
        </main>
      </main>
    );
  }
  return (
    <div className="min-h-screen flex justify-center items-center">
      <p className="text-[40px] flex flex-col justify-center items-center ">
       
        Please wait until the Admin accept your request
      <button onClick={()=>{router.push("/login")}} className="flex mt-[50px] justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Sign in
        </button>
      </p>
    </div>
  );
}
