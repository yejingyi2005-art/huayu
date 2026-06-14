interface PaperTapeProps {
  className?: string;
}

export function PaperTape({ className = "" }: PaperTapeProps) {
  return (
    <div
      className={`absolute h-7 w-24 rotate-[-5deg] rounded-sm border border-[#D9D2C3] bg-[#F4E9C8]/70 ${className}`}
    />
  );
}
