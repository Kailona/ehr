<?php

namespace OCA\EHR\Service;

use OCP\Http\Client\IClientService;
use OCP\ILogger;
use OCP\IUserSession;
use OCP\Mail\IMailer;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\Util;
use OCP\L10N\IFactory;

/**
 * Class MailService
 *
 * @package OCA\EHR\Service
 */
class MailService {
    public function __construct(ILogger $logger, IUserSession $userSession, IMailer $mailer, IFactory $l10nFactory) {
        $this->logger = $logger;
        $this->userSession = $userSession;
        $this->mailer = $mailer;
        $this->l10nFactory = $l10nFactory;

        $user = $userSession->getUser();
        $lang = $l10nFactory->getUserLanguage($user);
        $this->l10n = $this->l10nFactory->get('settings', $lang);
    }

    public function sendRequestDataMail(string $fromName, string $to, string $body) {
        $fromEmail = $this->userSession->getUser()->getEMailAddress();
        if (empty($fromEmail)) {
            return new JSONResponse(array('status' => 1, 'error' => 'Missing Email Address'), Http::STATUS_NOT_FOUND);
        }

        $link = sprintf('mailto:%s', $fromEmail);

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
        $emailTemplate->addBodyButton($this->l10n->t('Send Health Data'), $link);
        $emailTemplate->addFooter($this->l10n->t('This is an automatically sent email, please do not reply.'));

        $message = $this->mailer->createMessage();
        $message->setTo(array($to => $to));
        $message->useTemplate($emailTemplate);
        $this->mailer->send($message);

        return new JSONResponse(array('status' => 0, 'error' => 'Success'));
    }
}
