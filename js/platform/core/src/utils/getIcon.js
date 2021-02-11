import React from 'react';
import * as MuiIcons from '@material-ui/icons';

export default function(icon, fontSize = 80, color = null) {
    const style = {
        fontSize: fontSize,
    };

    if (color) {
        style.color = color;
    }

    // Find the mui icon by name if string
    if (typeof icon === 'string') {
        const MuiIcon = icon && MuiIcons[icon];
        return <MuiIcon style={style} />;
    }

    return icon;
}
