const SIZE_CLASSES = {
  xs: "w-[19px] h-[19px] text-[11px]",
  sm: "w-[20px] h-[20px] text-[11px] sm:w-[24px] sm:h-[24px] sm:text-[12px]",
  md: "w-[24px] h-[24px] text-[12px] sm:w-[32px] sm:h-[32px] sm:text-[15px]",
  lg: "w-[32px] h-[32px] text-[15px] sm:w-[44px] sm:h-[44px] sm:text-[20px]",
  xl: "w-[28px] h-[28px] text-[13px] sm:w-[40px] sm:h-[40px] sm:text-[19px] md:w-[60px] md:h-[60px] md:text-[28px]",
} as const;

export default function DigitTiles({
  digits,
  size = "md",
  variant = "default",
}: {
  digits: string[];
  size?: keyof typeof SIZE_CLASSES;
  variant?: "default" | "letters";
}) {
  return (
    <div className={`flex items-center ${size === "xs" ? "gap-0.5" : "gap-1"}`}>
      {digits.map((d, i) => (
        <div
          key={i}
          className={`digit-tile ${SIZE_CLASSES[size]} ${variant === "letters" ? "digit-tile-letters" : ""}`}
        >
          {d}
        </div>
      ))}
    </div>
  );
}
