import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VisitorCounter = () => {
    const [visitorCount, setVisitorCount] = useState(0);

    useEffect(() => {
        const fetchVisitorCount = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/visitor-count');
                setVisitorCount(response.data.count);
            } catch (error) {
                console.error('Error fetching visitor count:', error);
            }
        };

        const updateVisitorCount = async () => {
            try {
                await axios.post('http://127.0.0.1:5000/update-visitor-count');
                fetchVisitorCount();
            } catch (error) {
                console.error('Error updating visitor count:', error);
            }
        };

        fetchVisitorCount();
        updateVisitorCount();
    }, []);

    return visitorCount;
};

export default VisitorCounter;