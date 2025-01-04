"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconHome,
  IconUsers,
  IconBuilding,
  IconReceipt,
  IconCurrencyDollar,
  IconChartBar,
  IconFileText,
} from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Tableau de bord",
    href: "/agence/admin",
    icon: <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Locataires",
    href: "/agence/locataires",
    icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Biens",
    href: "/agence/biens",
    icon: <IconBuilding className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Ventes",
    href: "/agence/ventes",
    icon: <IconReceipt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Dépenses",
    href: "/agence/depenses",
    icon: <IconCurrencyDollar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Gains",
    href: "/agence/gains",
    icon: <IconChartBar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Rapports",
    href: "/agence/rapports",
    icon: <IconFileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
];

export function AgencySidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={cn(
      "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 h-screen"
    )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-2">
              {menuItems.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.href);
                  }}
                />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}