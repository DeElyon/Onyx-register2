import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => {}
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
         const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
         });
         return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
        {children}
        </AuthContext.Provider>
    );
}