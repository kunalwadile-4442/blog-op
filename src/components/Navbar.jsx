"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Globe, LayoutGrid, Loader2, LogOut, Menu, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const NavLink = ({ href, children }) => {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link
            href={href}
            className={`text-sm font-medium transition-colors hover:text-accent-foreground ${isActive
                ? 'text-accent-foreground border-b-2 border-primary'
                : 'text-muted-foreground'
                }`}
        >
            {children}
        </Link>
    )
}

const UserMenu = () => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        try {
            await signOut({ callbackUrl: '/auth/login' })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    if (status === 'authenticated') {
        const { name, email, image } = session.user
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8 md:h-9 md:w-9">
                            <AvatarImage src={image} alt="user-avatar" />
                            <AvatarFallback><img src={`https://ui-avatars.com/api/?name=${name.charAt(0).toUpperCase()}&background=6A5ACD&color=fff`} alt="user-avatar" /></AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{name.charAt(0).toUpperCase() + name.slice(1)}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex w-full">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex w-full">
                            <LayoutGrid className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                <AlertDialog open={loading}>
                    <AlertDialogContent className='max-w-80'>
                        <AlertDialogHeader className="flex gap-3 items-center ">
                            <AlertDialogTitle className='sr-only'>Loading</AlertDialogTitle>
                            <Loader2 className="animate-spin h-7 w-7" />
                            <AlertDialogDescription className='font-medium'>Logging out...</AlertDialogDescription>
                        </AlertDialogHeader>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenu>
        )
    }
}

const Navbar = () => {
    const { data: session } = useSession()
    const router = useRouter()

    return (
        <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-card/60 md:px-4">
            <div className="md:container flex p-3 items-center">
                <div className="flex items-center">
                    <Link href="/" className="mr-10 flex items-center">
                        <div className="p-[5px] rounded-xl bg-gradient-to-r from-primary via-violet-500 to-pink-500 mr-2">
                            <Globe className="text-white" />
                        </div>
                        <span className="font-bold text-xl">BlogOp</span>
                    </Link>
                    <nav className="items-center space-x-6 text-sm font-medium hidden md:inline-flex">
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/blogs">Explore</NavLink>
                        {session &&
                            <NavLink href="/dashboard">Dashboard</NavLink>
                        }
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end">
                    <nav className="flex items-center gap-3">
                        <ThemeToggle />
                        {session &&
                            <div className="md:hidden p-0 flex items-center">
                                <UserMenu />
                            </div>
                        }
                        <div className="hidden md:flex gap-2">
                            {!session ? (
                                <>
                                    <Link href="/auth/login">
                                        <Button variant="ghost">Login</Button>
                                    </Link>
                                    <Link href="/auth/signup">
                                        <Button>Sign Up</Button>
                                    </Link>
                                </>
                            ) : (
                                <UserMenu />
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="md:hidden p-1">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" >
                                <DropdownMenuItem onClick={() => router.push("/")}>
                                    Home
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/blogs")}>
                                    Explore
                                </DropdownMenuItem>
                                {!session && <>
                                    <DropdownMenuItem onClick={() => router.push("/auth/login")}>
                                        Login
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/auth/signup")}>
                                        Sign Up
                                    </DropdownMenuItem>
                                </>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                </div>
            </div>
        </header >
    );
};

export default Navbar;
