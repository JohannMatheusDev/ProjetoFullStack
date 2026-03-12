type Props = {
  vertical?: boolean;
};

export function Divisor({ vertical = false }: Props) {
  if (vertical) return <div className="h-full w-px bg-zinc-200 dark:bg-zinc-800" />;
  return <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800" />;
}
