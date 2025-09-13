import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light", // Always default to dark
  setTheme: () => null,
};

export const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "tuition-wave-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    const root = window.document.documentElement;

    // Always remove light and system classes, only add dark
    root.classList.remove("light", "dark", "system");
    root.classList.add("light");
  }, []); // Empty dependency array since theme never changes

  const value = React.useMemo(
    () => ({
      theme: "light" as Theme, // Always return dark
      setTheme: (requestedTheme: Theme) => {
        // Ignore the requested theme, always stay dark
        console.log(`Theme change to "${requestedTheme}" requested, but staying dark`);
        // Don't update localStorage or state since we're always dark
      },
    }),
    [] // No dependencies since values never change
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};