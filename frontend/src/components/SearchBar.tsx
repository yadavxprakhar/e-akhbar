import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [tempQuery, setTempQuery] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(tempQuery.trim());
    };

    const handleClear = () => {
        setTempQuery('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '400px', width: '100%', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search articles..."
                    value={tempQuery}
                    onChange={(e) => setTempQuery(e.target.value)}
                    style={{ paddingLeft: '38px', paddingRight: tempQuery ? '38px' : '16px' }}
                />
                
                {/* Magnifying Glass Indicator */}
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.9rem' }}>
                    🔍
                </span>

                {/* Clear Input X Trigger */}
                {tempQuery && (
                    <button
                        type="button"
                        onClick={handleClear}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'hsl(var(--muted))',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 700
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 18px' }}>
                Search
            </button>
        </form>
    );
};
