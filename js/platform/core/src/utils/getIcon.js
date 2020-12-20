import React from 'react';
import * as MuiIcons from '@material-ui/icons';

export default function(icon) {
    // Find the mui icon by name if string
    if (typeof icon === 'string') {
        const MuiIcon = icon && MuiIcons[icon];
        return <MuiIcon style={{ fontSize: 40 }} />;
    }

    return icon;
}
