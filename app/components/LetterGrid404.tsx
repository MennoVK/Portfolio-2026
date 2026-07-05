"use client";

import {useEffect, useState} from "react";
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
            <div className='select-none [&>div]:text-center flex flex-col justify-evenly h-svh overflow-hidden' aria-hidden='true'>
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
