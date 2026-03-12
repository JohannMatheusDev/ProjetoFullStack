import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  erro?: boolean;
};

export function Campo({ erro = false, className = "", ...props }: Props) {
  return (
    <input
      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors bg-white text-zinc-900 placeholder:text-zinc-400 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 ${erro ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-zinc-400 dark:border-zinc-700 dark:focus:border-zinc-500"} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}
