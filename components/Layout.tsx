import React, { FC } from "react";
import { Toaster } from "react-hot-toast";
import AppNav from "./AppNav";

export type Props = { children: React.ReactNode };

const Layout: FC<Props> = ({ children }: Props) => {
	return (
		<>
			<AppNav />
			<main className="w-full flex justify-center max-md:px-4 py-6 max-md:pt-5">
				{children}
			</main>

			<Toaster
				position="top-center"
				containerStyle={{ top: "14%" }}
				reverseOrder={false}
			/>
		</>
	);
};

export default Layout;
