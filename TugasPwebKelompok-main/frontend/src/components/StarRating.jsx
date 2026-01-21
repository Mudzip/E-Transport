import React from 'react';

const StarRating = ({ value, onChange, readOnly = false }) => {
    return (
        <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => !readOnly && onChange(star)}
                    style={{
                        cursor: readOnly ? 'default' : 'pointer',
                        fontSize: '1.5rem',
                        color: star <= value ? 'var(--warning)' : 'var(--gray-600)',
                        transition: 'color 0.2s'
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;
