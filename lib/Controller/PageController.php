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

		$response = new TemplateResponse(
			$this->appName,
			'index',
			[
				'appId' => $this->appName
			]
		);

		return $response;
	}
}
