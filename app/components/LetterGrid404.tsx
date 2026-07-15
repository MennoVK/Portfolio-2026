"use client";

import {useEffect, useRef, useState} from "react";
import {RollingLetter} from "./RollingLetter";

const letters = "40".split("");

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

    return rows;
};

export const LetterGrid404 = () => {
    const [grid, setGrid] = useState<Cell[][]>([]);
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
            <div ref={containerRef} className='select-none [&>div]:text-center flex flex-col justify-evenly h-svh overflow-hidden' aria-hidden='true'>
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className='flex justify-between'>
                        {row.map((cell, cellIndex) => {
                            return (
                                <RollingLetter key={`${rowIndex}-${cellIndex}`} className='w-full'>
                                    {cell.text}
                                </RollingLetter>
                            );
                        })}
                    </div>
                ))}
            </div>
        </>
    );
};
