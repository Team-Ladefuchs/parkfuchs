import React, { createContext, useState, ReactNode } from "react";
import { InboxCity } from "../db/types";

interface AppContextType {
	editCity: InboxCity | null;
	setEditCity: (city: InboxCity | null) => void;
	searchQuery: string;
	setSearchQuery: (value: string) => void;
}

export const AppContext = createContext<AppContextType>({
	editCity: null,
	setEditCity: () => {},
	searchQuery: "",
	setSearchQuery: () => {},
});

interface AppContextProviderProps {
	children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
	children,
}) => {
	const [selectedCity, setCity] = useState<InboxCity | null>(null);

	const setSelectedCity = (updateCity: InboxCity | null) => {
		setCity(updateCity);
	};

	const [searchQuery, setQuery] = useState<string>("");

	const setSearchQuery = (value: string) => {
		setQuery(value);
	};

	return (
		<AppContext.Provider
			value={{
				editCity: selectedCity,
				setEditCity: setSelectedCity,
				searchQuery,
				setSearchQuery,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
