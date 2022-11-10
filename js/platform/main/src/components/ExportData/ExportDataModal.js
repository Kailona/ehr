import React from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent as MuiDialogContent,
    Grid,
    withStyles,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormControl as MuiFormControl,
    styled,
} from '@material-ui/core';
import { KailonaTextField, KailonaButton, KailonaCloseButton } from '@kailona/ui';
import './ExportDataModal.styl';
import KailonaDateRangePicker from '../../../../ui/src/elements/DatePicker/KailonaDateRangePicker';
import moment from 'moment';
import { ModuleTypeEnum, PluginManager, getIcon } from '@kailona/core';

const DialogContent = withStyles({
    root: {
        height: '100%',
        margin: '0 20px 20px 20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EAEAEA',
        borderRadius: '5px',
        paddingBottom: '25px',
    },
})(MuiDialogContent);

const FormControl = styled(MuiFormControl)({
    marginTop: '20px',
    '& span': {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    },
    '& svg': {
        width: '30px',
        height: '30px',
    },
});

class ExportDataModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            filters: {
                dateRange: {
                    begin: moment().clone(),
                    end: moment(),
                },
            },
            selectedPlugins: [],
            checkAll: false,
            plugins: [],
            pluginColorModules: [],
        };

        this.toEmailRef = React.createRef();
    }

    getPlugins = () => {
        const menuItems = [];
        // Get menu modules from plugins
        // TODO: plugins can get from utils or lib(common folder). Not need repetition.
        PluginManager.plugins.forEach(plugin => {
            const { path, modules } = plugin;

            const menuModule = modules[ModuleTypeEnum.MenuModule];
            if (!menuModule) {
                return;
            }

            // Get the plugin's color data to use when checked.
            const color = this.getPluginColorModule(plugin);
            menuItems.push({
                path,
                color: color,
                ...menuModule,
            });
        });

        // Sort by priority (high priority comes first)
        menuItems.sort((mi1, mi2) => (mi1.priority < mi2.priority ? 1 : -1));

        this.state.plugins = menuItems;
    };

    getPluginColorModule = plugin => {
        const timelineModule = plugin.modules[ModuleTypeEnum.TimelineModule];

        if (Array.isArray(timelineModule) && timelineModule.length) {
            const validModules = timelineModule.filter(
                m =>
                    typeof m.getData === 'function' ||
                    (Array.isArray(m.children) && m.children.every(c => c.name && typeof c.getData === 'function'))
            );
            return validModules[0].color;
        }

        if (timelineModule) {
            logger.warn('Invalid Timeline Module', timelineModule.name);
        }
    };

    getMenuItems = () => {
        const { selectedPlugins, plugins } = this.state;
        // After get plugins first time, then not need to get again
        plugins.length == 0 && this.getPlugins();

        return plugins.map(menuItem => {
            const isChecked = selectedPlugins.some(element => element.name === menuItem.name);

            // That's not worked on Diabets img. So, changed it as scan with style.
            // ? getIcon(menuItem.icon, 30, menuItem.color ? menuItem.color : "#4dd0e1")
            const menuItemIcon = getIcon(menuItem.icon);

            return (
                <Grid item xs={4}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isChecked}
                                onChange={() => this.onCheckboxChange(menuItem)}
                                icon={<scan>{menuItemIcon}</scan>}
                                checkedIcon={<scan style={{ color: menuItem.color }}>{menuItemIcon}</scan>}
                            />
                        }
                        label={menuItem.name}
                    />
                </Grid>
            );
        });
    };

    onCheckboxChange = menuItem => {
        const { selectedPlugins, plugins } = this.state;

        const checkValue = selectedPlugins.indexOf(menuItem, 0);
        checkValue != -1 ? selectedPlugins.splice(checkValue, 1) : selectedPlugins.push(menuItem);

        // If user checked all of them without choose all checkbox. Check the all checkbox auto.
        const checkAllValue = selectedPlugins.length === plugins.length ? true : false;

        this.setState({ ...this.state, checkAll: checkAllValue });
    };

    onCheckAllChange = () => {
        const { plugins, checkAll } = this.state;

        let newSelectedPlugins = checkAll ? [] : [...plugins];
        // check checkAll's value before set. True means, checkbox is unchecked.
        this.setState({ ...this.state, selectedPlugins: newSelectedPlugins, checkAll: !checkAll });
    };

    render() {
        const { loading, filters, checkAll } = this.state;
        const menuItems = this.getMenuItems();

        return (
            <Dialog fullWidth={true} open={this.props.isOpen}>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>{t('ehr', 'Export Data')}</Box>
                        <Box>
                            <KailonaCloseButton onClose={this.props.onClose} />
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container direction="row">
                        <Grid item xs={6}>
                            <KailonaDateRangePicker
                                id="date"
                                defaultValue={filters.dateRange}
                                onChange={dateRange => this.setState({ ...this.state, filters: dateRange })}
                                ariaLabel={t('ehr', 'Filter by date')}
                                maxDate={new Date()}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <KailonaTextField
                                inputRef={this.toEmailRef}
                                id="providerEmail"
                                type="text"
                                label={t('ehr', 'Email')}
                                style={{ width: '100%' }}
                            />
                        </Grid>
                    </Grid>
                    <FormControl>
                        <Grid item xs={4}>
                            <FormControlLabel
                                control={<Checkbox checked={checkAll} onChange={this.onCheckAllChange} />}
                                label={t('ehr', 'All')}
                            />
                        </Grid>
                        <FormGroup row>{menuItems}</FormGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <KailonaButton
                        class="default"
                        title={t('ehr', 'Cancel')}
                        onClick={this.props.onClose}
                        disabled={loading}
                    />
                    {/* <KailonaButton
                        class="primary"
                        title={t('ehr', 'Send Request')}
                        onClick={this.sendRequest}
                        loading={loading}
                        disabled={loading}
                    /> */}
                </DialogActions>
            </Dialog>
        );
    }
}

export default ExportDataModal;
