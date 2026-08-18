import type { Config } from "tailwindcss";

// نظام الهوية البصرية — Dark Premium / Electric Blue
// مستوحى من الصورة المرجعية دون نسخها: أسود عميق، توهج أزرق كهربائي، فضي معدني.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05070C",       // خلفية أساسية
        surface: "#0B0F1A",    // بطاقات وأقسام
        surface2: "#111726",   // بطاقات مرتفعة / hover
        line: "#1C2437",       // حدود دقيقة
        electric: "#2E6FFF",   // Electric Blue
        neon: "#3FD8FF",       // Neon Blue glow
        silver: "#B7C1D6",     // نص ثانوي فضي
        ink: "#F3F6FC",        // نص أساسي
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        glow: "0 0 40px -5px rgba(63,216,255,0.35)",
        glowSm: "0 0 20px -4px rgba(63,216,255,0.4)",
      },
      backgroundImage: {
        "aperture-radial":
          "radial-gradient(circle at 50% 50%, rgba(63,216,255,0.16) 0%, rgba(46,111,255,0.06) 40%, rgba(5,7,12,0) 70%)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 3.5s ease-in-out infinite",
        rise: "rise 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
