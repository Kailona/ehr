---
id: plugins
title: Plugins
---

We use plugins to categorize and isolate behavioral and health data in the client platform. For example:

-   Physical Data including Weight, Height and Body Mass Index (BMI) is managed by the physical data plugin
-   Vital signs including blood pressure, oxygen saturation, etc. is managed by the vitals plugin
-   And many data

A plugin is a client-side npm package exporting a custom interface object in its entry point.

## Plugin Manager

The client platform has a plugin manager determines all available plugin form the config file and registers them to be
used by other components.

## Lifecycle

A lifecycle hook is called for each plugin before registration. Here is the main lifecycle:

1. Get available plugins from the config file

2. Call `onPreRegisteration` hook for each plugin, if defined

3. Register plugins in the plugin manager

4. Render dashboard

Plugins can use this lifecycle hook to import their dependencies, register other plugins, add event listeners, etc.

## Plugin Interface

A plugin interface is an object defining the following properties, components and functions:

-   `id`: Plugin ID that must be unique
-   `path`: URL path to redirect to the plugin main component
-   `name`: Plugin name
-   `MenuModule`: Interface object to show plugin menu item
-   `WidgetModule`: Interface object to show plugin widget in dashboard
-   `DataModule`: Interface object to render the plugin main component to manage / visualize plugin data
-   `TimelineModule`: Interface object to show plugin data in timeline that is displayed in dashboard

## Plugin Modules

Plugins are constructed by modules. All plugins must implement data module and one of menu or widget modules.

### Menu Module

Menu modules show plugins in profile menus, using the following properties:

-   `name`: Menu item name to be shown in profile menus
-   `icon`: Material icon name to be used as menu item icon in profile menus, as listed
    [here](https://material-ui.com/components/material-icons/)
-   `priority`: Menu item priority in profile menus, higher numbers at the top of the list

### Widget Module

Widget modules show plugins in profile menus displayed in the header, using the following properties:

-   `name`: Widget name to be shown in dashboard
-   `icon`: Material icon name to be used as widget icon in dashboard, as listed
    [here](https://material-ui.com/components/material-icons/)
-   `Component`: React component to be shown as widget in dashboard. This is very useful to visualize individual plugin
    data in dashboard.
-   `priority`: Menu item priority in profile menus, higher numbers in the left of the list

:::caution Define only one of "Component" or "icon" properties in the widget module! :::

### Timeline Module

Timeline modules provide plugin data to be visualized in dashboard timeline, using an array of objects with the
following properties:

-   `name`: Data name to be shown in timeline
-   `color`: Data color to be shown in timeline
-   `icon`: Data icon to be shown in timeline legend
-   `getData`: Function to retrieve timeline data, providing an array of objects with the following properties:
    -   `date`: Date/Time object of the data
    -   `value`: Number value of the data

The timeline displayed in dashboard is very important component to visualize and compare different plugin data in one
place.

:::important Plugins should group timeline data on daily basis! :::

### Data Module

Data module is a React Component to be rendered when user is redirected by dashboard.

## Example

```javascript
export default {
    id: 'plugin-vitals',
    path: '/vitals',
    name: 'Vitals',
    MenuModule: {
        name: 'Vitals',
        icon: 'FavoriteBorder',
        priority: 20,
    },
    WidgetModule: {
        name: 'Vitals',
        icon: 'FavoriteBorder',
        priority: 20,
    },
    DataModule: {
        Component: VitalsDataModule,
    },
    TimelineModule: [
        {
            name: 'Systolic Blood Pressure',
            color: '#36a3eb',
            icon: 'FavoriteBorder',
            getData: getTimelineBloodPressureSystolic,
        },
        {
            name: 'Diastolic Blood Pressure',
            color: '#41b3a3',
            icon: 'FavoriteBorder',
            getData: getTimelineBloodPressureDiastolic,
        },
    ],
};
```
