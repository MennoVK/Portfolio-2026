import {Analytics} from "@vercel/analytics/next";
import {SpeedInsights} from "@vercel/speed-insights/next";
import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import {MicroGrotesk} from "./utils/fonts";

const siteUrl = "https://mennoveerkamp.com";
const siteTitle = "Menno Veerkamp - Portfolio";
const siteDescription = "Frontend developer based in the Netherlands, specializing in performant and accessible web experiences.";
const ogImage = "/og-image.png";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: siteTitle,
    description: siteDescription,
    authors: [{name: "Menno Veerkamp", url: siteUrl}],
    applicationName: siteTitle,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: siteTitle,
        description: siteDescription,
        url: siteUrl,
        siteName: siteTitle,
        locale: "en_US",
        type: "website",
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: "A grid of letters with some highlighted showing off some projects",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description: siteDescription,
        images: [ogImage],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' className={`${MicroGrotesk.className} antialiased`}>
            <body className='h-screen w-screen bg-black text-white font-bold overflow-x-hidden'>
                <Link href='/' className='bg-black absolute top-5 left-9 w-45 h-55 z-10 flex items-center justify-center'>
                    <Image src='/logo.svg' alt='Logo' width={215} height={175} loading='eager' fetchPriority='high' className='px-9 w-50 h-auto pb-6' />
                </Link>
                <main className='h-full'>{children}</main>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
