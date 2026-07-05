import localFont from "next/font/local";

export const MicroGrotesk = localFont({
    src: [
        {
            path: "../../public/fonts/MicroGrotesk.woff2",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-MicroGrotesk",
});
