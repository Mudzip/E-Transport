import { useState } from 'react';

export default function TabSwitcher({ onTabChange, defaultTab = 'krl' }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        onTabChange?.(tabId);
    };

    return (
        <div className="tab-switcher">
            <button
                className={`tab-btn ${activeTab === 'krl' ? 'active' : ''}`}
                onClick={() => handleTabClick('krl')}
                type="button"
            >
                <span className="tab-emoji">🚇</span>
                <span className="tab-text">KRL Commuter</span>
            </button>

            <button
                className={`tab-btn ${activeTab === 'intercity' ? 'active' : ''}`}
                onClick={() => handleTabClick('intercity')}
                type="button"
            >
                <span className="tab-emoji">🚄</span>
                <span className="tab-text">Antar Kota</span>
            </button>
        </div>
    );
}
