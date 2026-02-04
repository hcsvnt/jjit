'use client';

import React from 'react';

export default function TestClient() {
    const [severState, setServerState] = React.useState(null);

    return (
        <button
            type="button"
            onClick={async () => {
                const res = await fetch('http://localhost:3000/api');
                const data = await res.json();
                setServerState(data.message);
            }}
        >
            {severState ? `Server says: ${severState}` : 'Click me'}
        </button>
    );
}
