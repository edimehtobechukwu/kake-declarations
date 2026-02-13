'use client';

import { useEffect, useState } from 'react';

export default function Background() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="mesh-container">
            <div className="mesh-gradient-1" />
            <div className="mesh-gradient-2" />
        </div>
    );
}
