<?php

namespace OCA\EHR\Service;

use \DateTime;
use \DateInterval;
use OCP\Http\Client\IClientService;
use OCP\ILogger;
use OCP\IUserSession;
use OCP\Mail\IMailer;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\Util;
use OCP\L10N\IFactory;
use OCP\Files\IRootFolder;
use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\Share;
use OCP\Share\IManager;
use OCP\IURLGenerator;

/**
 * Class MailService
 *
 * @package OCA\EHR\Service
 */
class MailService {
    public function __construct(
        ILogger $logger,
        IUserSession $userSession,
        IMailer $mailer,
        IFactory $l10nFactory,
        IRootFolder $rootFolder,
        IManager $shareManager,
        IURLGenerator $urlGenerator,
        string $userId = null
    ) {
        $this->logger = $logger;
        $this->userSession = $userSession;
        $this->mailer = $mailer;
        $this->l10nFactory = $l10nFactory;
        $this->rootFolder = $rootFolder;
        $this->shareManager = $shareManager;
        $this->urlGenerator = $urlGenerator;
        $this->currentUser = $userId;

        $this->userFolder = $this->rootFolder->getUserFolder($this->currentUser);

        $user = $userSession->getUser();
        $lang = $l10nFactory->getUserLanguage($user);
        $this->l10n = $this->l10nFactory->get('settings', $lang);
    }

    private function createUploadLink($parentFolder) {
        $folderName = 'Kailona/Data Requests/' . $parentFolder . '/' . date('Y-m-d H:i:s');

        if (!$this->userFolder->nodeExists($folderName)) {
            $this->userFolder->newFolder($folderName);
        }

        $share = $this->shareManager->newShare();

        $folder = $this->userFolder->get($folderName);
        $share->setNode($folder);

        // File drop (upload only)
        $share->setPermissions(4);
        $share->setShareType(3);

        $share->setSharedBy($this->currentUser);

        // Expire in 2 months
        $expireDate = new DateTime();
        $expireDate->add(new DateInterval('P2M'));
        $share->setExpirationDate($expireDate);

        $share = $this->shareManager->createShare($share);

        return $this->urlGenerator->linkToRouteAbsolute('files_sharing.sharecontroller.showShare', ['token' => $share->getToken()]);
    }

    public function sendRequestDataMail(string $patientId, string $fromName, string $to, string $body) {
        $fromEmail = $this->userSession->getUser()->getEMailAddress();

        if (empty($fromEmail)) {
            return new JSONResponse(array('status' => 1, 'error' => 'Missing Email Address'), Http::STATUS_NOT_FOUND);
        }

        $link = $this->createUploadLink($patientId);

        $emailTemplate = $this->mailer->createEMailTemplate('emailTemplates.RequestData', [
            'link' => $link,
            'displayname' => $fromName,
        ]);
        $emailTemplate->setSubject($this->l10n->t('Health Data Request'));
        $emailTemplate->addHeader();
        $emailTemplate->addHeading($this->l10n->t('This is health data request from %s', [$fromName]));
        $emailTemplate->addBodyText($body);
        $emailTemplate->addBodyText($this->l10n->t('Please confirm that the following patient information match with your records before sending health data!'));
        $emailTemplate->addBodyText($this->l10n->t('Patient Name: %s', [$fromName]));
        $emailTemplate->addBodyText($this->l10n->t('Patient Email: %s', [$fromEmail]));
        $emailTemplate->addBodyButton($this->l10n->t('Upload Health Data'), $link);
        $emailTemplate->addFooter($this->l10n->t('This is an automatically sent email, please do not reply.'));

        $message = $this->mailer->createMessage();
        $message->setTo(array($to => $to));
        $message->useTemplate($emailTemplate);
        $this->mailer->send($message);

        return new JSONResponse(array('status' => 0, 'error' => 'Success'));
    }

    public function sendExportDataMail(string $patientId, string $fromName, string $to, string $body, string $link) {
        $fromEmail = $this->userSession->getUser()->getEMailAddress();

        if (empty($fromEmail)) {
            return new JSONResponse(array('status' => 1, 'error' => 'Missing Email Address'), Http::STATUS_NOT_FOUND);
        }
        
        $emailTemplate = $this->mailer->createEMailTemplate('emailTemplates.ExportData', [
            'link' => $link,
            'displayname' => $fromName,
        ]);
        $emailTemplate->setSubject($this->l10n->t('Health Data Export'));
        $emailTemplate->addHeader();
        $emailTemplate->addBodyText($body);
        $emailTemplate->addBodyButton($this->l10n->t('See Health Data'), $link);
        $emailTemplate->addFooter($this->l10n->t('This is an automatically sent email, please do not reply.'));

        $message = $this->mailer->createMessage();
        $message->setTo(array($to => $to));
        $message->useTemplate($emailTemplate);
        $this->mailer->send($message);

        return new JSONResponse(array('status' => 0, 'error' => 'Success'));
    }
}
