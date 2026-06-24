"use client";
import { useState } from "react";
type Role = "admin" | "editor" | "viewer";
type Item = { label: string; href: string; roles: Role[]; children?: Item[] };
const menu: Item[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: ["admin", "editor", "viewer"],
  },
  { label: "Users", href: "/users", roles: ["admin"] },
  { label: "Content", href: "/content", roles: ["admin", "editor"] },
];
export default function RoleSidebar({
  role,
  pathname,
}: {
  role: Role;
  pathname: string;
}) {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebar") === "collapsed",
  );
  const toggle = () =>
    setCollapsed((c) => {
      localStorage.setItem("sidebar", !c ? "collapsed" : "open");
      return !c;
    });
  return (
    <aside>
      <button onClick={toggle} aria-expanded={!collapsed}>
        ☰
      </button>
      <nav>
        {menu
          .filter((x) => x.roles.includes(role))
          .map((x) => (
            <a
              key={x.href}
              href={x.href}
              aria-current={pathname === x.href ? "page" : undefined}
            >
              {collapsed ? x.label[0] : x.label}
            </a>
          ))}
      </nav>
    </aside>
  );
}
