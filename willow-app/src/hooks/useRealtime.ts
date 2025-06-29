import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../services/firebase/firestore';

export function useRealtime<T>(collectionName: string): T[] {
    const [data, setData] = useState<T[]>([]);

    useEffect(() => {
        const q = query(collection(db, collectionName));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))as T[];
            setData(items);
        });
        return unsubscribe;
    }, [collectionName]);

    return data;
}