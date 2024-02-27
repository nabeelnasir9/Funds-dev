"use client";

import { useState, useEffect, cloneElement } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { http } from "@/lib/config";
import { apiUrls } from "@/lib/apis";
import axios from "axios";
import { Audio, RotatingLines } from "react-loader-spinner";
import {
  ChevronRight,
  LayoutDashboard,
  Users,
  Hotel,
  Plane,
  Bus,
  User,
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
      icon: <HomeIcon />,
    },
    {
      name: "Pass out",
      path: "/dashboard/passOut",
      icon: <User />,
    },
    {
      name: "Invoices",
      path: "/dashboard/invoices",
      icon: <StickyNoteIcon />,
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
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
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
              "overflow-hidden transition-all"
            )}
          >
            <ul
              className="sidebar space-y-2  overflow-y-auto p-3"
              style={{
                maxHeight: "calc(100vh - 100px)",
              }}
            >
              <li
                className="flex justify-end rounded-md bg-blue-500 p-3 text-white"
                key={0}
              >
                <CommonTooltip
                  trigger={
                    <ChevronRight
                      className={cn("cursor-pointer transition-transform", {
                        "rotate-180": sidebarToggle,
                      })}
                      onClick={() => setSidebarToggle((prev) => !prev)}
                    />
                  }
                >
                  {sidebarToggle ? "Contract Sidebar" : "Expand Sidebar"}
                </CommonTooltip>
              </li>
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
                    <span
                      className={cn("transition-all", {
                        invisible: !sidebarToggle,
                        visible: sidebarToggle,
                      })}
                    >
                      {route.name}
                    </span>
                  </Link>
                </li>
              ))}
              {/* <CommonAccordion
								accordions={[
									{
										label: sidebarToggle ? ' Entries' : <Keyboard />,
										content: (
											<>
												{routes.map((route, i) => (
													<li key={i + 1}>
														<Link
															className={cn(
																{
																	'bg-gray-100':
																		path === route.path,
																},
																'flex cursor-pointer items-center justify-start gap-2 rounded-md p-3 transition-colors  hover:bg-gray-100',
															)}
															href={route.path}>
															<CommonTooltip
																trigger={cloneElement(route.icon, {
																	className: cn(
																		'max-w-[24px] min-w-[24px] flex-1',
																	),
																})}>
																{route.name}
															</CommonTooltip>
															<span
																className={cn('transition-all', {
																	invisible: !sidebarToggle,
																	visible: sidebarToggle,
																})}>
																{route.name}
															</span>
														</Link>
													</li>
												))}
											</>
										),
									},
									{
										label: sidebarToggle ? 'Data Sets' : <Database />,
										content: (
											<>
												{datasets.map((route, i) => (
													<li key={i + 1}>
														<Link
															className={cn(
																{
																	'bg-gray-100':
																		path === route.path,
																},
																'flex cursor-pointer items-center justify-start gap-2 rounded-md p-3 transition-colors  hover:bg-gray-100',
															)}
															href={route.path}>
															<CommonTooltip
																trigger={cloneElement(route.icon, {
																	className: cn(
																		'max-w-[24px] min-w-[24px] flex-1',
																	),
																})}>
																{route.name}
															</CommonTooltip>
															<span
																className={cn('transition-all', {
																	invisible: !sidebarToggle,
																	visible: sidebarToggle,
																})}>
																{route.name}
															</span>
														</Link>
													</li>
												))}
											</>
										),
									},
								]}
							/> */}

              {/* <li
								style={{
									display: 'flex',
									alignItems: 'center',
									marginLeft: '12px',
									marginTop: '32px',
									gap: '12px',
								}}>
								<CommonTooltip
									trigger={cloneElement(<Database />, {
										className: cn('max-w-[24px] min-w-[24px] flex-1'),
									})}>
									Data Sets
								</CommonTooltip>
								<span
									className={cn('transition-all', {
										invisible: !sidebarToggle,
										visible: sidebarToggle,
									})}
									style={{
										fontSize: '18px',
										fontWeight: 500,
										letterSpacing: '0.025em',
										lineHeight: '1.25rem',
									}}>
									Data Sets
								</span>
							</li> */}
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
      <p className="text-[40px]">
        {" "}
        Plx wait until the Admin accept your request
      </p>
    </div>
  );
}
