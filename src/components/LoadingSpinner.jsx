import { useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";

const sizeMap = {
  xs: { wrapper: "w-6 h-6", image: "w-5 h-5", border: "border" },
  sm: { wrapper: "w-12 h-12", image: "w-10 h-10", border: "border-2" },
  md: { wrapper: "w-16 h-16", image: "w-14 h-14", border: "border-4" },
  lg: { wrapper: "w-24 h-24", image: "w-20 h-20", border: "border-4" },
};

const LoadingSpinner = ({
  message = "Loading...",
  fullScreen = false,
  size = "md",
  inline = false,
}) => {
  const { isDark } = useTheme();
  const computedSize = useMemo(() => sizeMap[size] || sizeMap.md, [size]);

  const spinner = (
    <div
      className={`relative flex items-center justify-center ${computedSize.wrapper}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`absolute inset-0 rounded-full ${computedSize.border} border-solid border-transparent animate-spin`}
        style={{
          borderTopColor: isDark ? "#38bdf8" : "#2563eb",
          borderLeftColor: isDark ? "#38bdf8" : "#2563eb",
          borderRightColor: isDark ? "rgba(148, 163, 184, 0.35)" : "rgba(148, 163, 184, 0.35)",
          borderBottomColor: isDark ? "rgba(148, 163, 184, 0.15)" : "rgba(148, 163, 184, 0.1)",
        }}
      ></div>
      <div
        className={`rounded-full overflow-hidden shadow-sm ${computedSize.image}`}
        aria-hidden="true"
      >
        <img
          src="/assets/logo.jpg"
          alt="MovieMaster Loading"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );

  if (inline) {
    return spinner;
  }

  return (
    <div
      className={`${
        fullScreen
          ? "min-h-screen flex flex-col items-center justify-center gap-4"
          : "flex flex-col items-center gap-3"
      }`}
    >
      {spinner}
      {message && (
        <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

