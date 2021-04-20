import { DocumentService } from '@kailona/core';
import DocumentsDataModule from './components/DocumentsDataModule';

export default {
    id: 'plugin-documents',
    path: '/documents',
    name: 'Documents',
    MenuModule: {
        name: 'Documents',
        icon: 'DescriptionOutlined',
        priority: 90,
    },
    WidgetModule: {
        name: 'Documents',
        icon: 'DescriptionOutlined',
        priority: 90,
    },
    DataModule: {
        Component: DocumentsDataModule,
        importData: async file => {
            const documentService = new DocumentService();
            await documentService.import(file);
        },
    },
};
