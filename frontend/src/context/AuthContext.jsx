import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();


export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);

	useEffect(() => {
		if (!authUser) {
			fetch("/api/auth/me", {
				credentials: "include",
			})
				.then((res) => (res.ok ? res.json() : null))
				.then((data) => {
					if (data && data._id) {
						setAuthUser(data);
						localStorage.setItem("chat-user", JSON.stringify(data));
					}
				});
		}
		// eslint-disable-next-line
	}, []);

	return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};