import clsx from "clsx";

export const RollingLetter = ({children, className}: {children: string; className?: string}) => {
    return (
        <div className={clsx("inline-flex overflow-hidden letter opacity-15", className)}>
            <span className='inline-block text-shadow-[0_-1.5rem_0_currentColor] w-full'>{children}</span>
        </div>
    );
};
