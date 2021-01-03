<?php

namespace OCA\EHR\Controller;

use OCP\AppFramework\Controller;
use OCP\IRequest;
use OCP\ILogger;

use OCA\EHR\Service\FHIRService;

/**
 * Class FHIRController
 *
 * @package OCA\EHR\Controller
 */
class FHIRController extends Controller {
    public function __construct(ILogger $logger, string $AppName, IRequest $request, FHIRService $service, $userId){
        parent::__construct($AppName, $request);
        $this->service = $service;
        $this->userId = $userId;
        $this->logger = $logger;
    }

    private function getQueryParams() {
        $requestUri = $this->request->getRequestUri();
        $qPos = strpos($requestUri, '?');
        if (!$qPos) {
            return null;
        }

        return substr($requestUri, $qPos + 1);
    }

    private function getRawBody() {
        return file_get_contents('php://input');
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
	public function transaction() {
        $body = $this->getRawBody();
        return $this->service->create('', $body);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
	public function create(string $type) {
        $body = $this->getRawBody();
        return $this->service->create($type, $body);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function read(string $type, string $id) {
        return $this->service->read($type, $id);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function vread(string $type, string $id, string $vid) {
        return $this->service->vread($type, $id, $vid);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function update(string $type, string $id) {
        $body = $this->getRawBody();
        return $this->service->update($type, $id, $body);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function patch(string $type, string $id) {
        $body = $this->getRawBody();
        return $this->service->patch($type, $id, $body);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function delete(string $type, string $id) {
        return $this->service->delete($type, $id);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function history(string $type, string $id) {
        return $this->service->history($type, $id);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function search(string $type) {
        $queryParams = $this->getQueryParams();
        return $this->service->search($type, $queryParams);
    }
}
