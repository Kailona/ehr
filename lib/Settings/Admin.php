<?php

namespace OCA\EHR\Settings;

use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use OCP\Settings\ISettings;

class Admin implements ISettings {

    /** @var IConfig */
    private $config;

    /**
     * Admin constructor.
     *
     * @param IConfig $config
     */
    public function __construct(IConfig $config) {
        $this->config = $config;
    }

    /**
     * @return TemplateResponse
     */
    public function getForm() {
        $fhirPassword = $this->config->getAppValue('ehr', 'fhirPassword');

        // Hide the password if exists
        if ($fhirPassword) {
            $fhirPassword = '*****';
        }

        $response = new TemplateResponse(
            'ehr',
            'admin',
            [
                'appId' => 'ehr',
                'settings' => [
                    'fhirBaseUrl' => $this->config->getAppValue('ehr', 'fhirBaseUrl'),
                    'fhirUsername' => $this->config->getAppValue('ehr', 'fhirUsername'),
                    'fhirPassword' => $fhirPassword,
                    'googleFitClientId' => $this->config->getAppValue('ehr', 'googleFitClientId')
                ]
            ]
        );

        return $response;
    }

    /**
     * @return string the section ID, e.g. 'sharing'
     */
    public function getSection() {
        return 'ehr';
    }

    /**
     * @return int whether the form should be rather on the top or bottom of
     * the admin section. The forms are arranged in ascending order of the
     * priority values. It is required to return a value between 0 and 100.
     */
    public function getPriority() {
        return 0;
    }

}
