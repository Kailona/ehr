import { DocumentService } from '@kailona/core';
import DocumentsDataModule from './components/DocumentsDataModule';

export default {
    id: 'plugin-documents',
    path: '/documents',
    name: t('ehr', 'Documents'),
    MenuModule: {
        name: t('ehr', 'Documents'),
        icon: 'DescriptionOutlined',
        priority: 50,
    },
    WidgetModule: {
        name: t('ehr', 'Documents'),
        icon: 'DescriptionOutlined',
        priority: 50,
    },
    DataModule: {
        Component: DocumentsDataModule,
        importData: async file => {
            const documentService = new DocumentService();
            await documentService.import(file);
        },
    },
};
