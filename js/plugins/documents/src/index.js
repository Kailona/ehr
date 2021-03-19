import { ProfileManager } from '@kailona/core';
import DocumentsDataModule from './components/DocumentsDataModule';
import axios from 'axios/index';

export default {
    id: 'plugin-documents',
    path: '/documents',
    name: 'Documents',
    MenuModule: {
        name: 'Documents',
        icon: 'FileCopy',
        priority: 90,
    },
    WidgetModule: {
        name: 'Documents',
        icon: 'FileCopy',
        priority: 90,
    },
    DataModule: {
        Component: DocumentsDataModule,
        importData: async file => {
            const parent = ProfileManager.activePatientId;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('parent', parent);
            const url = `/apps/ehr/documents/import`;

            await axios({
                method: 'POST',
                url,
                data: formData,
            });
        },
    },
};
