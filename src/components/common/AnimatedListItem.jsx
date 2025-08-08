import React from 'react';

export default function AnimatedListItem({ children, index }) {
    return (
        <div className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
            {children}
        </div>
    );
}