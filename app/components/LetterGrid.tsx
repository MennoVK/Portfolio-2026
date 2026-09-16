"use client";

import clsx from "clsx";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {RollingLetter} from "./RollingLetter";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&".split("");
const projects = [
    {title: "LARASARI", link: "https://larasari.com"},
    {title: "LOUWMANMUSEUM", link: "https://louwmanmuseum.nl"},
    {title: "GEORGIESCHRODER", link: "https://georgieschroder.com"},

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
    const width = Math.max(12, Math.floor(window.innerWidth / 21));
    const height = Math.max(8, Math.floor(window.innerHeight / 21));

    const rows: Cell[][] = Array.from(
        {length: height},
        () =>
            Array.from(
                {length: width},
                (): Cell => ({
                    text: letters[Math.floor(Math.random() * letters.length)],
                })
            )
    );

    const isMobile = window.innerWidth < 640;

    const emailLabel = isMobile ? "CONTACT" : email;

    const emailStart = Math.floor(width / 2) - Math.floor(emailLabel.length / 2);
    const labelStart = Math.floor(width / 2) - Math.floor(label.length / 2);

    // Fixed header
    for (let index = 0; index < label.length; index++) {
        rows[0][labelStart + index] = {
            text: label[index],
            isInfo: true,
        };
    }

    // Fixed footer
    for (let index = 0; index < emailLabel.length; index++) {
        const column = emailStart + index;

        if (column < 0 || column >= width) continue;

        rows[height - 1][column] = {
            text: emailLabel[index],
            href: `mailto:${email.toLowerCase()}`,
            isInfo: true,
        };
    }

    const shuffledColors = [...projectColors].sort(
        () => Math.random() - 0.5
    );

   const availableRows = Array.from(
    {length: Math.max(0, height - 2)},
    (_, index) => index + 1
    ).sort(() => Math.random() - 0.5);

    const shuffledProjects = [...projects].sort(() => Math.random() - 0.5);

    shuffledProjects.forEach((project, index) => {
        const titleLength = project.title.length;

        // Not enough horizontal space
        if (titleLength > width) {
            console.warn(
                `Project "${project.title}" doesn't fit: ${titleLength} chars > ${width} columns`
            );
            return;
        }

        // Not enough rows
        const row = availableRows[index];

        if (row === undefined) {
            console.warn(
                `Project "${project.title}" couldn't be placed: not enough rows`
            );
            return;
        }

        // Random horizontal position
        const start = Math.floor(
            Math.random() * (width - titleLength + 1)
        );

        const colorClass =
            shuffledColors[index % shuffledColors.length];

        for (let letterIndex = 0; letterIndex < titleLength; letterIndex++) {
            rows[row][start + letterIndex] = {
                text: project.title[letterIndex],
                href: project.link,
                colorClass,
                linkId: project.link,
            };
        }
    });

    return rows;
};


export const LetterGrid = () => {
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lettersRef = useRef<HTMLSpanElement[]>([]);

    useEffect(() => {
        const update = () => setGrid(buildGrid());

        update();
        window.addEventListener("resize", update);

        return () => window.removeEventListener("resize", update);
    }, []);

    useEffect(() => {
        lettersRef.current = Array.from(containerRef.current?.querySelectorAll(".letter span") ?? []);
    }, [grid]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) return;

        let timeout: number | undefined;

        const loop = () => {
            const els = lettersRef.current;

            if (els.length) {
                const el = els[Math.floor(Math.random() * els.length)];

                if (!el) return;

                el.classList.remove("animate-roll");

                requestAnimationFrame(() => {
                    el.classList.add("animate-roll");
                });
            }

            timeout = window.setTimeout(loop, 140 + Math.random() * 220);
        };

        loop();

        return () => {
            if (timeout) window.clearTimeout(timeout);
        };
    }, [grid]);

    return (
        <>
            <div ref={containerRef} className='select-none [&>div]:text-center flex flex-col justify-evenly h-svh overflow-hidden py-5 px-5' aria-hidden='true'>
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
