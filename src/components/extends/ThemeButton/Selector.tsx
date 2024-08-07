// const Theme = ({ theme, onChange }: { theme: string; onChange: (value: string) => void }) => {
//   const themeIcons = {
//     system: <SunIcon />,
//     dark: <MoonIcon color="white" />,
//     light: <SunIcon />,
//   };

//   return (
//     <div className="flex items-center justify-between">
//       <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => onChange(theme === 'dark' ? 'light' : 'dark')}>
//         {themeIcons[theme]}
//       </Button>
//     </div>
//   );
// };

// export const ThemeSelector = () => {
//   const { theme, setTheme } = useContext(ThemeContext);
//   const changeTheme = useCallback(
//     (value: string) => {
//       setTheme(value);
//     },
//     [setTheme],
//   );

//   return (
//     <div className="flex flex-col items-center justify-center bg-white pt-6 dark:bg-gray-900 sm:pt-0">
//       <div className="absolute bottom-0 left-0 m-4">
//         <Theme theme={theme} onChange={changeTheme} />
//       </div>
//     </div>
//   );
// };