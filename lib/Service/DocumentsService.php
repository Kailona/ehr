<?php

namespace OCA\EHR\Service;

use OCP\Files\IRootFolder;
use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\Files\FileInfo;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IDateTimeFormatter;
use OCP\ILogger;

class DocumentsService {
    public function __construct(
        IRootFolder $rootFolder,
        IDateTimeFormatter $dateTimeFormatter,
        ILogger $logger,
        string $userId = null
    ) {
        $this->rootFolder = $rootFolder;
        $this->dateTimeFormatter = $dateTimeFormatter;
        $this->logger = $logger;
        $this->currentUser = $userId;

        $this->folderName = 'Kailona/Documents';

        $this->userFolder = $this->rootFolder->getUserFolder($this->currentUser);

        if (!$this->userFolder->nodeExists($this->folderName)) {
            $this->userFolder->newFolder($this->folderName);
        }
    }

    private function getFileNodesRecursively($folderName) {
        if (!$this->userFolder->nodeExists($folderName)) {
            return [];
        }

        $folder = $this->userFolder->get($folderName);
        $nodes = $folder->getDirectoryListing();

        $fileNodes = [];

        foreach($nodes as $node) {
            if ($node->getType() === FileInfo::TYPE_FOLDER) {
                $fileNodes = array_merge($fileNodes, $this->getFileNodesRecursively($this->userFolder->getRelativePath($node->getPath())));
            } else {
                array_push($fileNodes, $node);
            }
        }

        return $fileNodes;
    }

    public function import($file, $parent) {
        $parentFolder =  $this->folderName . '/' .$parent;
        $fileName = $parentFolder . '/' . $file['name'];

        $content = fopen($file['tmp_name'], 'rb');
        if ($content === false) {
            $this->logger->logError('Unable to read file content, ' . $fileName);
            return new JSONResponse(array(), Http::STATUS_BAD_REQUEST);
        }

        if (!$this->userFolder->nodeExists($parentFolder)) {
            $this->userFolder->newFolder($parentFolder);
        }

        if ($this->userFolder->nodeExists($fileName)) {
            $target = $this->userFolder->get($fileName);
        } else {
            $target = $this->userFolder->newFile($fileName);
        }

        $target->fopen('w');
        $target->putContent($content);
    }

    public function fetch($parentFolder, $offset = 0, $limit = 10) {
        $files = [];

        // Get all files from documents and data requests recursively
        $documentFileNodes = $this->getFileNodesRecursively($this->folderName . '/' . $parentFolder);
        $dataRequestFileNodes = $this->getFileNodesRecursively('Kailona/Data Requests/' . $parentFolder);
        $nodes = array_merge($documentFileNodes, $dataRequestFileNodes);

        // Sort files by timestamp desc
        usort($nodes, function($node1, $node2) {
            return $node1 -> getMTime() < $node2 -> getMTime();
        });

        // Limit files for pagination
        $nodes = array_slice($nodes, $offset, $limit);

        foreach($nodes as $node) {
            $id = $node->getId();
            $path = '/apps/files/?dir=' . $this->userFolder->getRelativePath($node->getParent()->getPath()) . '&openfile=' . $id;
            $name = $node->getName();
            $timestamp = $node -> getMTime();
            $modifiedDate = $this->dateTimeFormatter->formatDateTime($timestamp, 'medium');

            $fileInfo = array('path' => $path, 'name'=> $name, 'modifiedDate' => $modifiedDate);

            array_push($files, $fileInfo);
        }

        return $files;
    }

    public function export($file, $parent) {
        $parentFolder =  'Kailona/Data Exports/' . date('Y-m-d H:i:s');
        $fileName = $parentFolder . '/' . $file['name'];

        $content = fopen($file['tmp_name'], 'rb');
        if ($content === false) {
            $this->logger->logError('Unable to read file content, ' . $fileName);
            return new JSONResponse(array(), Http::STATUS_BAD_REQUEST);
        }

        if (!$this->userFolder->nodeExists($parentFolder)) {
            $this->userFolder->newFolder($parentFolder);
        }

        if ($this->userFolder->nodeExists($fileName)) {
            $target = $this->userFolder->get($fileName);
        } else {
            $target = $this->userFolder->newFile($fileName);
        }

        $target->fopen('w');
        $target->putContent($content);
    }

    private function createExportLink($parentFolder) {
        $folderName = 'Kailona/Data Exports/' . $parentFolder ;

        if (!$this->userFolder->nodeExists($folderName)) {
            $this->userFolder->newFolder($folderName);
        }

        $share = $this->shareManager->newShare();

        $folder = $this->userFolder->get($folderName);
        $share->setNode($folder);

        // File drop (upload only)
        $share->setPermissions(1);
        $share->setShareType(3);

        $share->setSharedBy($this->currentUser);

        // Expire in 2 months
        $expireDate = new DateTime();
        $expireDate->add(new DateInterval('P2M'));
        $share->setExpirationDate($expireDate);

        $share = $this->shareManager->createShare($share);

        return $this->urlGenerator->linkToRouteAbsolute('files_sharing.sharecontroller.showShare', ['token' => $share->getToken()]);
    }
}
