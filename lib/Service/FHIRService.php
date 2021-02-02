<?php

namespace OCA\EHR\Service;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IUserSession;
use OCP\IConfig;
use OCP\Http\Client\IClientService;
use OCP\ILogger;
use Exception;

class FHIRService {
    public function __construct(ILogger $logger, string $appName, IUserSession $userSession, IConfig $config, IClientService $clientService) {
        $this->logger = $logger;
        $this->appName = $appName;
        $this->clientService = $clientService;
        $this->config = $config;

        $fhirBaseUrl = $this->config->getAppValue('ehr', 'fhirBaseUrl');
        $fhirUsername = $this->config->getAppValue('ehr', 'fhirUsername');
        $fhirPassword = $this->config->getAppValue('ehr', 'fhirPassword');

        $this->fhirConfig = [
            'baseUrl' => $fhirBaseUrl,
            'auth' => [$fhirUsername, $fhirPassword]
        ];

        // Alert if FHIR Server is not configured yet
        if (!$fhirBaseUrl || !$fhirUsername || !$fhirPassword) {
            $this->logger->error("FHIR Server credentials are invalid. Please configure FHIR Server in the admin settings.");
        }

        $this->userId = $userSession->getUser()->getUID();
        $this->fhirPatientId = $this->config->getUserValue($this->userId, 'ehr', 'fhirPatientId', null);
    }

    private function mapSearchQueryParams(string $resourceType, string $queryParamsStr) {
        if ($this->fhirPatientId == null) {
            return null;
        }

        // Convert query string to array
        $queryParams = array();
        if ($queryParamsStr != null) {
            $queryParamsStrSplit = explode('&', $queryParamsStr);
            for ($i = 0; $i < count($queryParamsStrSplit); $i++) {
                $queryParamKeyValueToMapSplit = explode('=', $queryParamsStrSplit[$i]);
                if (count($queryParamKeyValueToMapSplit) == 2) {
                    $queryParams[$queryParamKeyValueToMapSplit[0]] = $queryParamKeyValueToMapSplit[1];
                }
            }
        }

        // Map query params
        $patientIdQueryParam = null;
        switch ($resourceType) {
            case 'Patient':
                $queryParams['_id'] = $queryParams['_id'] ?: $this->fhirPatientId;
                break;
            default:
                $queryParams['patient'] = $queryParams['patient'] ?: 'Patient/' . $this->fhirPatientId;
                break;
        }

        // Skip if there is not query param
        if (count($queryParams) < 1) {
            return null;
        }

        // Convert array to query string
        $mappedQueryParams = '';
        foreach ($queryParams as $key => $value) {
            if ($mappedQueryParams == '') {
                $mappedQueryParams = $key . '=' . $value;
            } else {
                $mappedQueryParams .= '&' . $key . '=' . $value;
            }
        }

        return $mappedQueryParams;
    }

    private function replaceBaseFHIRURLs($resource) {
        // Replace Base FHIR URL in bundle links
        if ($resource != null && $resource['link'] != null) {
            for ($i = 0; $i < count($resource['link']); $i++) {
                $resource['link'][$i]['url'] = str_replace($this->fhirConfig['baseUrl'], '/apps/ehr/fhir/', $resource['link'][$i]['url']);
            }
        }
        
        return $resource;
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
        $bodyResource = null;
        if ($body != null) {
            $requestOptions['body'] = $body;
            $bodyResource = json_decode($body, true) ?? '';
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

            $responseResource = json_decode($response->getBody(), true) ?? '';

            $responseResource = $this->replaceBaseFHIRURLs($responseResource);

            $jsonResponseToSend = new JSONResponse($responseResource);

            foreach ($response->getHeaders() as $key => $value) {
                if ($key == 'Location') {
                    // Disable redirect on PUT
                    if ($method != 'PUT') {
                        $jsonResponseToSend->addHeader($key, str_replace($this->fhirConfig['baseUrl'], '/apps/ehr/fhir/', $value[0]));
                    }

                    // Store fhir patient id on create
                    if ($method == 'POST' && $bodyResource != null && $bodyResource['resourceType'] == 'Patient' && $bodyResource['identifier'][0]['value'] == $this->userId) {
                        $patientReadUrlSplit = explode('/', $value[0]);
                        if (count($patientReadUrlSplit) > 3) {
                            $fhirPatientId = $patientReadUrlSplit[count($patientReadUrlSplit) - 3];
                            $this->config->setUserValue($this->userId, 'ehr', 'fhirPatientId', $fhirPatientId);
                        }
                    }
                } else {
                    $jsonResponseToSend->addHeader($key, $value[0]);
                }
            }

			return $jsonResponseToSend;
		} catch (Exception $e) {
            $this->logger->logException($e);
            return new JSONResponse(array(), Http::STATUS_BAD_REQUEST);
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

        // Replace patient id in search for security
        $mappedQueryParams = $this->mapSearchQueryParams($type, $queryParams);

        // Prevent access without query params for security
        if ($mappedQueryParams == null) {
            return new JSONResponse(array(), Http::STATUS_OK);
        }

        return $this->fetch('GET', $url, $mappedQueryParams);
    }
}
