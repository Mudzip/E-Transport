import React, { useState, useEffect } from 'react';

const PlatformStats = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Increment visitor count on first load
        const incrementVisitor = async () => {
            try {
                // Check if we already counted this session to avoid spamming refresh
                const sessionKey = 'hasVisited';
                if (!sessionStorage.getItem(sessionKey)) {
                    await fetch(`${import.meta.env.VITE_API_URL}/syllabus/visitor/increment`, { method: 'POST' });
                    sessionStorage.setItem(sessionKey, 'true');
                }

                const res = await fetch(`${import.meta.env.VITE_API_URL}/syllabus/visitor`);
                const data = await res.json();
                setCount(data.count);
            } catch (error) {
                console.error('Error fetching visitor count:', error);
            }
        };

        incrementVisitor();
    }, []);

    return (
        <div style={{
            background: '#1e293b',
            color: 'white',
            padding: '2rem 1rem',
            textAlign: 'center',
            marginTop: 'auto'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
                <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#38bdf8' }}>{count}</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Happy Travelers</div>
                </div>
                <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>24/7</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Support</div>
                </div>
                <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#34d399' }}>100%</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Secure Payment</div>
                </div>
            </div>
            <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.4 }}>
                &copy; 2026 E-Transport Group. All rights reserved.
            </div>
        </div>
    );
};

export default PlatformStats;
