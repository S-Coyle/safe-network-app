import React from 'react';
import { Grid, Button, Typography } from '@material-ui/core';

// import { logger } from '$Logger';
// import styles from './Account.css';

export const PermissionsGranted = () => {
    return (
        <>
            <Typography variant="h5">Permissions Granted</Typography>
            <Typography variant="body2">A list of granted apps...</Typography>
        </>
    );
};