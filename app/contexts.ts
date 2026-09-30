import { createContext } from "react";
import { User } from "./page";


export const ScreenContext = createContext<[string, (value: string) => void]>(["", () => { }]);
export const UserContext = createContext<[User | null, (value: User | null) => void]>([{ uid: "" }, () => { }]);
export type PetInformation = {
	id: string;
	petName: string;
	petSpecies: string;
	petImage?: string;
	authorId: string;
	authorName: string;
	authorEmail?: string;
	lastSeenLocation?: { latitude: number; longitude: number } | null;
};
export const SelectedPetContext = createContext<[PetInformation | null, (value: PetInformation | null) => void]>([null, () => { }]);