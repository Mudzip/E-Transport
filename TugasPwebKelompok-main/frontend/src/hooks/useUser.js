import { useState, useEffect } from 'react';

export function useUser() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Check localStorage for existing userId
        let storedId = localStorage.getItem('transport_user_id');

        if (!storedId) {
            // Generate new ID if none exists
            storedId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('transport_user_id', storedId);
        }

        setUserId(storedId);
    }, []);

    return userId;
}
