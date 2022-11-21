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
import { ModuleTypeEnum, PluginManager, getIcon, DocumentService, MailService, ProfileManager } from '@kailona/core';
import PhysicalDataService from '../../../../../plugins/physicalData/src/services/PhysicalDataService';
import Logger from '@kailona/core/src/services/Logger';
import { withNotification } from '../../context/NotificationContext';
import theme from '../../../../ui/src/theme';

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

const logger = new Logger('main.ExportData');

class ExportDataModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            exporting: false,
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

        this.timelineModules = [];
        this.toEmailRef = React.createRef();

        this.documentService = new DocumentService();
        this.mailService = new MailService();
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
            const color = this.getPluginTimelineModule(plugin);
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

    getPluginTimelineModule = plugin => {
        const timelineModule = plugin.modules[ModuleTypeEnum.TimelineModule];

        if (timelineModule && typeof timelineModule.getData === 'function') {
            return this.timelineModules.push(timelineModule);
        }

        if (Array.isArray(timelineModule) && timelineModule.length) {
            const validModules = timelineModule.find(
                m =>
                    typeof m.getData === 'function' ||
                    (Array.isArray(m.children) && m.children.every(c => c.name && typeof c.getData === 'function'))
            );
            this.timelineModules.push({
                ...validModules,
                plugin: plugin,
            });
            return validModules.color;
        }

        if (timelineModule) {
            logger.warn('Invalid Timeline Module', timelineModule.name);
        }
    };

    getCheckboxItems = () => {
        const { selectedPlugins, plugins } = this.state;
        // After get plugins first time, then not need to get again
        plugins.length == 0 && this.getPlugins();

        return plugins.map(checkboxItem => {
            const isChecked = selectedPlugins.some(element => element.name === checkboxItem.name);

            // That's not worked on Diabets img. So, changed it as scan with style.
            // ? getIcon(checkboxItem.icon, 30, checkboxItem.color ? checkboxItem.color : "#4dd0e1")
            const checkboxItemIcon = getIcon(checkboxItem.icon);

            return (
                <Grid item xs={4}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isChecked}
                                onChange={() => this.onCheckboxChange(checkboxItem)}
                                icon={<scan>{checkboxItemIcon}</scan>}
                                checkedIcon={<scan style={{ color: checkboxItem.color }}>{checkboxItemIcon}</scan>}
                            />
                        }
                        label={
                            <label
                                style={{
                                    color: isChecked
                                        ? checkboxItem.color
                                            ? checkboxItem.color
                                            : theme.palette.secondary.main
                                        : 'black',
                                    fontWeight: isChecked ? 'bold' : 'normal',
                                }}
                                onClick={() => this.onCheckboxChange(checkboxItem)}
                            >
                                {checkboxItem.name}
                            </label>
                        }
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

    fetchData = async () => {
        const { filters, selectedPlugins } = this.state;
        const files = [];

        if (selectedPlugins.length === 0) {
            return this.props.showNotification({
                severity: 'warning',
                message: t('ehr', 'Please select at least one'),
            });
        }
        if (this.toEmailRef.current.value === '') {
            return this.props.showNotification({
                severity: 'warning',
                message: t('ehr', 'Need to enter an email address'),
            });
        }

        try {
            this.setState({
                exporting: true,
            });

            for (const plugin of selectedPlugins) {
                let queueData = [];
                const timelineModule = this.timelineModules.find(module => module.plugin.name === plugin.name);

                if (!timelineModule) {
                    if (plugin.name === 'Physical Data' || plugin.priority === 100) {
                        let params = [
                            {
                                date: `ge${moment(filters.dateRange.begin)
                                    .hour(0)
                                    .minute(0)
                                    .second(0)
                                    .utc()
                                    .toISOString()}`,
                            },
                            {
                                date: `le${moment(filters.dateRange.end)
                                    .hour(23)
                                    .minute(59)
                                    .second(59)
                                    .utc()
                                    .toISOString()}`,
                            },
                            {
                                code: 'http://loinc.org|34565-2',
                                _include: 'Observation:has-member',
                            },
                        ];

                        await new PhysicalDataService().fetchData(params).then(data => {
                            if (data.length) {
                                queueData.push({
                                    name: plugin.name,
                                    data,
                                });
                            }
                        });
                    } else if (plugin.name === 'Documents' || plugin.priority === 50) {
                        // parameters can be changed.
                        await this.documentService.fetch().then(data => {
                            if (data.length) {
                                queueData.push({
                                    name: plugin.name,
                                    data: data.data,
                                });
                            }
                        });
                    }
                } else {
                    if (typeof timelineModule.getData === 'function') {
                        await timelineModule.getData(filters.dateRange.begin, filters.dateRange.end).then(data => {
                            if (data.length) {
                                queueData.push({
                                    name: timelineModule.name,
                                    data,
                                });
                            }
                        });
                    } else if (timelineModule.children) {
                        const promises = [];

                        timelineModule.children.forEach(child => {
                            child.getData(filters.dateRange.begin, filters.dateRange.end).then(data => {
                                if (data.length) {
                                    const promise = new Promise(resolve =>
                                        resolve({
                                            name: child.name,
                                            data,
                                        })
                                    );
                                    promises.push(promise);
                                }
                            });
                        });

                        promises.length &&
                            (await Promise.all(promises).then(result => {
                                queueData.push(...result);
                            }));
                    }
                }

                if (queueData.length) {
                    const csvFile = this.convertToCSVFormat(queueData, plugin.name);
                    files.push(csvFile);
                }
            }
            if (!files.length) {
                this.setState({
                    exporting: false,
                });

                this.props.onClose();

                return this.props.showNotification({
                    severity: 'info',
                    message: t('ehr', 'Data not found on the related date to export.'),
                });
            }

            // Export files in nextcloud folder and create a link inside of export function. At then, send the link via email.
            await this.documentService.export(files).then(async result => {
                const to = this.toEmailRef.current.value;
                const patientId = ProfileManager.activePatientId;
                const { patientFullName: fromName } = ProfileManager.activeProfile;
                const body = t(
                    'ehr',
                    `The data for patient "${fromName}" was exported on Kailona platform 
                    ${moment().format('MMMM Do YYYY h:mm:ss a')}. `
                );

                await this.mailService.sendExportData(patientId, fromName, to, body, result.data);
            });

            this.setState({
                exporting: false,
            });

            this.props.onClose();

            this.props.showNotification({
                severity: 'success',
                message: t('ehr', 'Data has been successfully exported and sent to related email.'),
            });
        } catch (error) {
            logger.error('Failed to export data', error);

            this.setState({
                exporting: false,
            });

            this.props.showNotification({
                severity: 'error',
                message: t('ehr', 'An error occurred while exporting data. Please contact your administrator.'),
            });
        }
    };

    convertToCSVFormat = (allData, documentName) => {
        // TODO: Converting to CSV Format. Will carry into utils folder as common.
        let formattedArray = [];

        allData.map(element => {
            element.data.map(e => {
                const keys = Object.keys(e);
                const values = Object.values(e);

                values.map((value, index) => {
                    if (Array.isArray(value) || typeof value === 'object') {
                        delete e[keys[index]];
                    }
                });
            });

            const objectData = Object.assign({}, ...element.data);
            formattedArray.push({
                name: element.name,
                ...objectData,
            });
        });

        const csvContent = formattedArray
            .map(e => {
                let value = '';
                // first get keys with pipe between of each
                Object.keys(e).forEach(key => {
                    value += `${key.charAt(0).toUpperCase()}${key.slice(1)}|`;
                });
                value += '\n';
                // then get values with pipe between of each
                Object.values(e).map(valueKey => {
                    // replaceAll for the date's format. Because of date values have comma.
                    value += valueKey.toString() + '|';
                });
                return value;
            })
            .join('\n');

        var file = new File([csvContent], `${documentName}.csv`, { type: 'text/csv;charset=utf-8' });
        return file;
    };

    render() {
        const { exporting, checkAll } = this.state;
        const checkboxItems = this.getCheckboxItems();

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
                                date={{ begin: new Date(), end: new Date() }}
                                onChange={dateRange =>
                                    this.setState({ ...this.state, filters: { dateRange: dateRange } })
                                }
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
                                label={
                                    <label
                                        style={{
                                            color: checkAll ? theme.palette.secondary.main : theme.palette.black.main,
                                            fontWeight: checkAll ? 'bold' : 'normal',
                                        }}
                                        onClick={this.onCheckAllChange}
                                    >
                                        {t('ehr', 'All')}
                                    </label>
                                }
                            />
                        </Grid>
                        <FormGroup row>{checkboxItems}</FormGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <KailonaButton
                        class="default"
                        title={t('ehr', 'Cancel')}
                        onClick={this.props.onClose}
                        disabled={exporting}
                    />
                    <KailonaButton
                        class="primary"
                        title={t('ehr', 'Export Data')}
                        onClick={this.fetchData}
                        loading={exporting}
                        disabled={exporting}
                    />
                </DialogActions>
            </Dialog>
        );
    }
}

export default withNotification(ExportDataModal);
