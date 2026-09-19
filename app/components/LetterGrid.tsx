"use client";

import clsx from "clsx";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {RollingLetter} from "./RollingLetter";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&".split("");
const projects = [
  { title: "LARASARI", link: "https://larasari.com" },
  { title: "GEORGIESCHRODER", link: "https://georgieschroder.com" },
  { title: "LOUWMANMUSEUM", link: "https://louwmanmuseum.nl" },
];
const label = "WORK";
const email = "CONTACT@MENNOVEERKAMP.COM";
const projectColors = [
  "text-green",
  "text-red",
  "text-cyan",
  "text-pink",
  "text-yellow",
];

// Keep these in sync with the container's `py-5 px-5` classes below.
const VERTICAL_PADDING = 40; // py-5 top + bottom, in px
const HORIZONTAL_PADDING = 40; // px-5 left + right

type Cell = {
  text: string;
  href?: string;
  isInfo?: boolean;
  colorClass?: string;
  linkId?: string;
};

const buildGrid = (container: HTMLDivElement | null) => {
  // Prefer the container's actual computed padding, falling back to the
  // known constants if the ref isn't attached yet.
  const paddingY = container
    ? parseFloat(getComputedStyle(container).paddingTop) * 2
    : VERTICAL_PADDING;
  const paddingX = container
    ? parseFloat(getComputedStyle(container).paddingLeft) * 2
    : HORIZONTAL_PADDING;

  const availableWidth = window.innerWidth - paddingX;
  const availableHeight = window.innerHeight - paddingY;

  const width = Math.max(12, Math.floor(availableWidth / 20));
  const height = Math.max(8, Math.floor(availableHeight / 25));

  const rows: Cell[][] = Array.from({ length: height }, () =>
    Array.from(
      { length: width },
      (): Cell => ({
        text: letters[Math.floor(Math.random() * letters.length)],
      }),
    ),
  );

  const isMobile = window.innerWidth < 640;
  const emailLabel = isMobile ? "CONTACT" : email;
  const emailStart = Math.floor(width / 2) - Math.floor(emailLabel.length / 2);
  const labelStart = Math.floor(width / 2) - Math.floor(label.length / 2);

  for (let index = 0; index < label.length; index++) {
    rows[0][labelStart + index] = { text: label[index], isInfo: true };
  }

  for (let index = 0; index < emailLabel.length; index++) {
    rows[height - 1][emailStart + index] = {
      text: emailLabel[index],
      href: `mailto:${email.toLowerCase()}`,
      isInfo: true,
    };
  }

  const shuffledColors = [...projectColors].sort(() => Math.random() - 0.5);
  const usedRows = new Set<number>();

  projects.forEach((project, index) => {
    // Still skip if the title is literally wider than the grid.
    if (project.title.length >= width) return;

    const colorClass = shuffledColors[index % shuffledColors.length];

    // Prefer rows that haven't been used by another project yet, so
    // projects don't compete for the same row and crowd each other out.
    // Row 0 holds the label, row (height - 1) holds the email — avoid both.
    const allRows = Array.from({ length: height - 3 }, (_, i) => i + 2);
    const freeRows = allRows.filter((r) => !usedRows.has(r));
    const rowPool = freeRows.length ? freeRows : allRows;
    const shuffledRows = [...rowPool].sort(() => Math.random() - 0.5);

    let placement: { row: number; start: number } | null = null;

    // Exhaustively try every row/start combo (in random order) instead of
    // giving up after a fixed number of random attempts. This only fails
    // now if the grid genuinely can't fit the project anywhere.
    for (const row of shuffledRows) {
      const maxStart = width - project.title.length;
      const starts = Array.from({ length: maxStart + 1 }, (_, i) => i).sort(
        () => Math.random() - 0.5,
      );
      const start = starts.find((s) =>
        Array.from(
          { length: project.title.length },
          (_, letterIndex) => rows[row][s + letterIndex],
        ).every((cell) => !cell.href),
      );

      if (start !== undefined) {
        placement = { row, start };
        break;
      }
    }

    if (!placement) return;

    usedRows.add(placement.row);

    for (
      let letterIndex = 0;
      letterIndex < project.title.length;
      letterIndex++
    ) {
      rows[placement.row][placement.start + letterIndex] = {
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
    const update = () => setGrid(buildGrid(containerRef.current));

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    lettersRef.current = Array.from(
      containerRef.current?.querySelectorAll(".letter span") ?? [],
    );
  }, [grid]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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
      <div
        ref={containerRef}
        className="select-none [&>div]:text-center flex flex-col justify-evenly h-full overflow-hidden py-5 px-5"
        aria-hidden="true"
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-between">
            {row.map((cell, cellIndex) => {
              const content = cell.href ? (
                <Link
                  key={`${rowIndex}-${cellIndex}`}
                  href={cell.href}
                  target="_blank"
                  tabIndex={-1}
                  onMouseEnter={() =>
                    setHoveredLinkId(cell.linkId ?? cell.href ?? null)
                  }
                  onMouseLeave={() =>
                    setHoveredLinkId((current) =>
                      current === (cell.linkId ?? cell.href ?? null)
                        ? null
                        : current,
                    )
                  }
                  className={clsx(
                    "w-full",
                    hoveredLinkId === (cell.linkId ?? cell.href ?? null) &&
                      "md:underline",
                    cell.isInfo ? "opacity-80" : cell.colorClass,
                  )}
                >
                  {cell.text}
                </Link>
              ) : cell.isInfo ? (
                <span
                  key={`${rowIndex}-${cellIndex}`}
                  className="w-full opacity-80"
                >
                  {cell.text}
                </span>
              ) : (
                <RollingLetter
                  key={`${rowIndex}-${cellIndex}`}
                  className="w-full"
                >
                  {cell.text}
                </RollingLetter>
              );

              return content;
            })}
          </div>
        ))}
      </div>
      <div className="sr-only">
        <ul>
          {projects.map((project) => (
            <li key={project.title}>
              <Link href={project.link} target="_blank">
                {project.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="mailto:contact@mennoveerkamp.com">
              contact@mennoveerkamp.com
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};
