<?php

namespace OCA\EHR\Service;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;
use OCP\Http\Client\IClientService;
use OCP\ILogger;
use Exception;

class FHIRService {
    public function __construct(ILogger $logger, string $appName, IClientService $clientService) {
        $this->logger = $logger;
        $this->appName = $appName;
        $this->clientService = $clientService;

        $fhirBaseUrl = \OC::$server->getConfig()->getAppValue('ehr', 'fhirBaseUrl');
        $fhirUsername = \OC::$server->getConfig()->getAppValue('ehr', 'fhirUsername');
        $fhirPassword = \OC::$server->getConfig()->getAppValue('ehr', 'fhirPassword');

        $this->fhirConfig = [
            'baseUrl' => $fhirBaseUrl,
            'auth' => [$fhirUsername, $fhirPassword]
        ];

        // Alert if FHIR Server is not configured yet
        if (!$fhirBaseUrl || !$fhirUsername || !$fhirPassword) {
            $this->logger->error("FHIR Server credentials are invalid. Please configure FHIR Server in the admin settings.");
        }
    }

    private function fetch(string $method, string $url, string $queryParams = null, string $body = null) {
        $client = $this->clientService->newClient();

        $fhirUrl = sprintf("%s%s", $this->fhirConfig['baseUrl'], $url);

        // Append query string parameters if exists
        if ($queryParams != null) {
            $fhirUrl = sprintf("%s?%s", $fhirUrl, $queryParams);
        }

        $requestOptions = [
            'auth' => $this->fhirConfig['auth'],
            'headers' => [
                'Content-Type' => 'application/fhir+json'
            ]
        ];

        // Append body if exists
        if ($body != null) {
            $requestOptions['body'] = $body;
        }

		try {
            switch ($method) {
                case 'GET':
                    $response = $client->get($fhirUrl, $requestOptions);
                    break;
                case 'POST':
                    $response = $client->post($fhirUrl, $requestOptions);
                    break;
                case 'PUT':
                    $response = $client->put($fhirUrl, $requestOptions);
                    break;
                case 'PATCH':
                    $response = $client->patch($fhirUrl, $requestOptions);
                    break;
                case 'DELETE':
                    $response = $client->delete($fhirUrl, $requestOptions);
                    break;
            }

			return json_decode($response->getBody(), true) ?? '';
		} catch (Exception $e) {
            $this->logger->logException($e);
            return new DataResponse([], Http::STATUS_BAD_REQUEST);
		}
    }

    public function create(string $type, string $body) {
        $url = sprintf('%s', $type);
        return $this->fetch('POST', $url, null, $body);
    }

    public function read(string $type, string $id) {
        $url = sprintf('%s/%s', $type, $id);
        return $this->fetch('GET', $url);
    }

    public function vread(string $type, string $id, string $vid) {
        $url = sprintf('%s/%s/_history/%s', $type, $id, $vid);
        return $this->fetch('GET', $url);
    }

    public function update(string $type, string $id, string $body) {
        $url = sprintf('%s/%s', $type, $id);
        return $this->fetch('PUT', $url, null, $body);
    }

    public function patch(string $type, string $id, string $body) {
        $url = sprintf('%s/%s', $type, $id);
        return $this->fetch('PATCH', $url, null, $body);
    }

    public function delete(string $type, string $id) {
        $url = sprintf('%s/%s', $type, $id);
        return $this->fetch('DELETE', $url, null);
    }

    public function history(string $type, string $id) {
        $url = sprintf('%s/%s/_history', $type, $id);
        return $this->fetch('GET', $url, null);
    }

    public function search(string $type, string $queryParams = null) {
        $url = sprintf('%s', $type);
        return $this->fetch('GET', $url, $queryParams);
    }
}
