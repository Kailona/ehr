<?php

namespace OCA\EHR\Service;

use OCP\Http\Client\IClientService;
use OCP\ILogger;

class SettingsService {
    protected $adminSettings = [
        'fhirBaseUrl' => null,
        'fhirUsername' => null,
        'fhirPassword' => null
    ];

    public function __construct(ILogger $logger, string $appName, IClientService $clientService) {
        $this->logger = $logger;
        $this->appName = $appName;
        $this->clientService = $clientService;
    }

    public function saveAdminSettings(array $settings) {
        $success = true;

        foreach ($settings as $name => $value) {
            if (!array_key_exists($name, $this->adminSettings)) {
                $success = false;
                continue;
            }

            // Do not update fhir password when hidden mask was sent
            if ($name == 'fhirPassword' && $value == '*****') {
                continue;
            }

            \OC::$server->getConfig()->setAppValue(
                'ehr',
                $name,
                $value
            );
        }

        return $success;
    }
}
