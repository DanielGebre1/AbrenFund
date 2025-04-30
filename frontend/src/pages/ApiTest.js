import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ApiTest() {
    const [message, setMessage] = useState('');
    const [protectedMessage, setProtectedMessage] = useState('');

    // Test public API
    useEffect(() => {
        api.get('/test')
            .then(response => setMessage(response.data.message))
            .catch(error => console.error('Public API error:', error));
    }, []);

    // Test protected API
    const testProtectedApi = async () => {
        try {
            const response = await api.get('/protected');
            setProtectedMessage(response.data.message);
        } catch (error) {
            console.error('Protected API error:', error);
            setProtectedMessage('Not authenticated');
        }
    };

    return (
        <div>
            <h2>Public API Response: {message}</h2>
            <button onClick={testProtectedApi}>Test Protected API</button>
            <h3>Protected API: {protectedMessage}</h3>
        </div>
    );
}

export default ApiTest;