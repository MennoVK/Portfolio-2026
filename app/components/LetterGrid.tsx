"use client";

import clsx from "clsx";
import Link from "next/link";
import {useEffect, useState} from "react";
import {RollingLetter} from "./RollingLetter";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&".split("");
const projects = [
    {title: "LARASARI", link: "https://larasari.com"},
    {title: "LOUWMANMUSEUM", link: "https://louwmanmuseum.nl"},
];
const label = "WORK";
const email = "CONTACT@MENNOVEERKAMP.COM";
const projectColors = ["text-green", "text-red", "text-cyan", "text-pink", "text-yellow"];

type Cell = {
    text: string;
    href?: string;
    isInfo?: boolean;
    colorClass?: string;
    linkId?: string;
};

const buildGrid = () => {
    const width = Math.max(12, Math.floor(window.innerWidth / 25));
    const height = Math.max(8, Math.floor(window.innerHeight / 25));

    const rows: Cell[][] = Array.from({length: height}, () => Array.from({length: width}, (): Cell => ({text: letters[Math.floor(Math.random() * letters.length)]})));

    const isMobile = window.innerWidth < 640;
    const emailLabel = isMobile ? "CONTACT" : email;
    const emailStart = Math.floor(width / 2) - Math.floor(emailLabel.length / 2);
    const labelStart = Math.floor(width / 2) - Math.floor(label.length / 2);

    for (let index = 0; index < label.length; index++) {
        rows[0][labelStart + index] = {text: label[index], isInfo: true};
    }

    for (let index = 0; index < emailLabel.length; index++) {
        rows[height - 1][emailStart + index] = {text: emailLabel[index], href: `mailto:${email.toLowerCase()}`, isInfo: true};
    }

    const shuffledColors = [...projectColors].sort(() => Math.random() - 0.5);

    projects.forEach((project, index) => {
        if (project.title.length >= width) return;

        const colorClass = shuffledColors[index % shuffledColors.length];
        const maxAttempts = 100;
        let placement: {row: number; start: number} | null = null;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const row = 2 + Math.floor(Math.random() * (height - 3));
            const start = Math.floor(Math.random() * (width - project.title.length + 1));
            const canFit = Array.from({length: project.title.length}, (_, letterIndex) => rows[row][start + letterIndex]).every((cell) => !cell.href);

            if (canFit) {
                placement = {row, start};
                break;
            }
        }

        if (!placement) return;

        for (let letterIndex = 0; letterIndex < project.title.length; letterIndex++) {
            rows[placement.row][placement.start + letterIndex] = {text: project.title[letterIndex], href: project.link, colorClass, linkId: project.link};
        }
    });

    return rows;
};

export const LetterGrid = () => {
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);

    useEffect(() => {
        const update = () => setGrid(buildGrid());

        update();
        window.addEventListener("resize", update);

        return () => window.removeEventListener("resize", update);
    }, []);

    useEffect(() => {
        let timeout: number;

        const loop = () => {
            const els = document.querySelectorAll(".letter span");

            if (els.length) {
                const el = els[Math.floor(Math.random() * els.length)];

                el.classList.remove("animate-roll");

                requestAnimationFrame(() => {
                    el.classList.add("animate-roll");
                });
            }

            timeout = window.setTimeout(loop, 60 + Math.random() * 120);
        };

        loop();

        return () => window.clearTimeout(timeout);
    }, []);

    return (
        <>
            <div className='select-none [&>div]:text-center flex flex-col justify-evenly h-full' aria-hidden='true'>
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className='flex justify-between'>
                        {row.map((cell, cellIndex) => {
                            const content = cell.href ? (
                                <Link
                                    key={`${rowIndex}-${cellIndex}`}
                                    href={cell.href}
                                    target='_blank'
                                    tabIndex={-1}
                                    onMouseEnter={() => setHoveredLinkId(cell.linkId ?? cell.href ?? null)}
                                    onMouseLeave={() => setHoveredLinkId((current) => (current === (cell.linkId ?? cell.href ?? null) ? null : current))}
                                    className={clsx("w-full", hoveredLinkId === (cell.linkId ?? cell.href ?? null) && "md:underline", cell.isInfo ? "opacity-80" : cell.colorClass)}
                                >
                                    {cell.text}
                                </Link>
                            ) : cell.isInfo ? (
                                <span key={`${rowIndex}-${cellIndex}`} className='w-full opacity-80'>
                                    {cell.text}
                                </span>
                            ) : (
                                <RollingLetter key={`${rowIndex}-${cellIndex}`} className='w-full'>
                                    {cell.text}
                                </RollingLetter>
                            );

                            return content;
                        })}
                    </div>
                ))}
            </div>
            <div className='sr-only'>
                <ul>
                    {projects.map((project) => (
                        <li key={project.title}>
                            <Link href={project.link} target='_blank'>
                                {project.title}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link href='mailto:contact@mennoveerkamp.com'>contact@mennoveerkamp.com</Link>
                    </li>
                </ul>
            </div>
        </>
    );
};
