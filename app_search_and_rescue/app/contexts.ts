import { createContext } from "react";


export const ScreenContext = createContext<[string, (value: string) => void]>(["", () => { }]);