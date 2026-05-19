import React from 'react';

interface CategoryFilterProps {
    currentCategory: string;
    onSelectCategory: (category: string) => void;
}

const CATEGORIES = [
    { id: 'general', label: '📰 General', color: '#6366f1' },
    { id: 'technology', label: '💻 Tech', color: '#3b82f6' },
    { id: 'business', label: '💼 Business', color: '#10b981' },
    { id: 'sports', label: '⚽ Sports', color: '#f59e0b' }
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ currentCategory, onSelectCategory }) => {
    return (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {CATEGORIES.map((cat) => {
                const isActive = currentCategory.toLowerCase() === cat.id.toLowerCase();
                
                return (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                        style={{
                            padding: '8px 18px',
                            fontSize: '0.88rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            borderRadius: '20px', // Soft rounded bubble badges
                            border: isActive ? 'none' : '1px solid hsl(var(--border) / 0.5)',
                            transform: 'none',
                            boxShadow: isActive ? `0 4px 12px -3px ${cat.color}66` : 'none'
                        }}
                    >
                        <span>{cat.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
