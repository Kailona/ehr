<?php

namespace OCA\EHR\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;

/**
 * Class PageController
 *
 * @package OCA\EHR\Controller
 */
class PageController extends Controller {
	/**
     * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @return TemplateResponse
	 */
	public function index() {
		$googleFitClientId = \OC::$server->getConfig()->getAppValue('ehr', 'googleFitClientId');
		
		$response = new TemplateResponse(
			$this->appName,
			'index',
			[
				'appId' => $this->appName,
				'data' => [
					'googleFitClientId' => $googleFitClientId
				]
			]
		);

		return $response;
	}
}
