import React from 'react';
import { Spinner } from 'react-bootstrap';

const SpinLoader = () => (
    <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
    </Spinner>
);

export default SpinLoader;
