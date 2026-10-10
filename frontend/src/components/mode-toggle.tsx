import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="btn btn-outline btn-sm"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        padding: 0,
      }}
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={15} />
      ) : (
        <Moon size={15} />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

