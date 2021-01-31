<?php

namespace OCA\EHR\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use OCP\ILogger;

use OCA\EHR\Service\SettingsService;

/**
 * Class SettingsController
 *
 * @package OCA\EHR\Controller
 */
class SettingsController extends Controller {
    public function __construct(ILogger $logger, string $AppName, IRequest $request, SettingsService $service) {
        parent::__construct($AppName, $request);
        $this->service = $service;
        $this->logger = $logger;
    }

    /**
     * @NoCSRFRequired
     */
	public function admin(string $fhirBaseUrl, string $fhirUsername, string $fhirPassword) {
        try {
            return $this->service->saveAdminSettings([
                'fhirBaseUrl' => $fhirBaseUrl,
                'fhirUsername' => $fhirUsername,
                'fhirPassword' => $fhirPassword
            ]);
        } catch (\Exception $ex) {
            return new DataResponse([], Http::STATUS_BAD_REQUEST);
        }
    }
}
