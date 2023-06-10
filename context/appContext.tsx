import React, { createContext, useState, ReactNode } from "react";
import { InboxCity } from "../db/types";

interface AppContextType {
	editCity: InboxCity | null;
	setEditCity: (city: InboxCity | null) => void;
}

export const AppContext = createContext<AppContextType>({
	editCity: null,
	setEditCity: () => {},
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

	return (
		<AppContext.Provider
			value={{
				editCity: selectedCity,
				setEditCity: setSelectedCity,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
