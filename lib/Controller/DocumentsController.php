<?php

namespace OCA\EHR\Controller;

use OCP\AppFramework\Controller;
use OCP\IRequest;
use OCP\ILogger;

use OCA\EHR\Service\DocumentsService;

class DocumentsController extends Controller
{
    public function __construct(ILogger $logger, string $AppName, IRequest $request, DocumentsService $service) {
        parent::__construct($AppName, $request);
        $this->service = $service;
        $this->logger = $logger;
        $this->request = $request;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function import() {
        $file = $this->request->getUploadedFile('file');
        $parent = $this->request->getParam('parent');
        return $this->service->import($file, $parent);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function fetch($parent, $offset, $limit) {
        return $this->service->fetch($parent, $offset, $limit);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function export() {
        $file = $this->request->getUploadedFile('file');
        return $this->service->export($file);
    }
}
