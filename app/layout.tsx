import {Analytics} from "@vercel/analytics/next";
import {SpeedInsights} from "@vercel/speed-insights/next";
import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import {MicroGrotesk} from "./utils/fonts";

export const metadata: Metadata = {
    title: "Menno Veerkamp - Portfolio",
    description: "Frontend developer based in the Netherlands, specializing in performant and accesible web experiences.",
    openGraph: {
        title: "Menno Veerkamp - Portfolio",
        description: "Frontend developer based in the Netherlands, specializing in performant and accesible web experiences.",
        url: "https://mennoveerkamp.com",
        siteName: "Menno Veerkamp - Portfolio",
        images: [
            {
                url: "https://mennoveerkamp.com/og-image.png",
                width: 1200,
                height: 630,
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' className={`${MicroGrotesk.className} antialiased`}>
            <body className='h-screen w-screen px-5 py-3 bg-black text-white font-bold'>
                <Link href='/' className='bg-black absolute top-5 left-1/2 -translate-x-1/2 z-50'>
                    <Image src='/logo.svg' alt='Logo' width={215} height={175} loading='eager' fetchPriority='high' className='px-9 w-40 h-auto' />
                </Link>
                <main className='h-full'>{children}</main>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
