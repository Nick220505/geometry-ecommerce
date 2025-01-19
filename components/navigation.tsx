"use client";

import { useTranslation } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Navigation() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold">
            Geometry & Essences
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link href="/store">
              <Button variant="ghost">{t("nav.store")}</Button>
            </Link>
            {session?.user.role === "ADMIN" && (
              <Link href="/admin/dashboard">
                <Button variant="ghost">{t("nav.dashboard")}</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder-avatar.png"
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback>
                    {session?.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {session?.user ? (
                <>
                  <DropdownMenuItem disabled>
                    {session.user.name || session.user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    {t("cta.signout")}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Link href="/auth/login">{t("cta.signin")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/auth/register">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
