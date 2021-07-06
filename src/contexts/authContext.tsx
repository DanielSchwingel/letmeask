import { createContext, useState, useEffect, ReactNode } from 'react';

import { firebase, auth } from '../services/firebase';

type AuthContextProviderProps = {
   children: ReactNode;
}

type User = {
	id: string;
	name: string;
	avatar: string;
}
 
type AuthContextType = {
	user: User | undefined;
	signInWithGoogle: () => Promise<void>;
	signOutWihtGoogle: () => Promise<void>;
	loading: boolean;
}
export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props : AuthContextProviderProps) {
	const [ loading, setLoading ] = useState(true);
	const [ user, setUser ] = useState<User>();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			if (user) {
				const { displayName, photoURL, uid } = user;
	
				if (!displayName || !photoURL) {
					throw new Error('Missing information from Google Account.')
				}
	
				setUser({
					id: uid,
					name: displayName,
					avatar: photoURL
				});
				setLoading(false);
			}	
			
		})

		return () => {
			unsubscribe()
		}
	}, []);

	async function signInWithGoogle() {
		const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
		
		if (result.user) {
			const { displayName, photoURL, uid } = result.user;

			if (!displayName || !photoURL) {
				throw new Error('Missing information from Google Account.')
			}

			setUser({
				id: uid,
				name: displayName,
				avatar: photoURL
			})
		}
      
	}

	async function signOutWihtGoogle() {
		await auth.signOut();
	}

   return (
      <AuthContext.Provider 
			value={{ 
				user, 
				signInWithGoogle, 
				signOutWihtGoogle,
				loading
			}}>
         {props.children}
      </AuthContext.Provider>
   )
}