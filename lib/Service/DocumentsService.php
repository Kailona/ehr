<?php

namespace OCA\EHR\Service;

use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IDateTimeFormatter;
use OCP\ILogger;

class DocumentsService {
    public function __construct(Folder $rootFolder, IDateTimeFormatter $dateTimeFormatter, ILogger $logger) {
        $this->rootFolder = $rootFolder;
        $this->dateTimeFormatter = $dateTimeFormatter;
        $this->logger = $logger;
        $this->folderName = "Kailona/Documents";

        if (!$this->rootFolder->nodeExists($this->folderName)) {
            $this->rootFolder->newFolder($this->folderName);
        }
    }

    public function import($file, $parent) {
        $parentFolder =  $this->folderName . "/" .$parent;
        $fileName = $parentFolder . "/" . $file['name'];

        $content = fopen($file['tmp_name'], 'rb');
        if ($content === false) {
            $this->logger->logError('Unable to read file content, ' . $fileName);
            return new JSONResponse(array(), Http::STATUS_BAD_REQUEST);
        }

        if (!$this->rootFolder->nodeExists($this->folderName)) {
            $this->rootFolder->newFolder($this->folderName);
        }

        if (!$this->rootFolder->nodeExists($parentFolder)) {
            $this->rootFolder->newFolder($parentFolder);
        }

        if ($this->rootFolder->nodeExists($fileName)) {
            $target = $this->rootFolder->get($fileName);
        } else {
            $target = $this->rootFolder->newFile($fileName);
        }

        $target->fopen('w');
        $target->putContent($content);
    }

    public function fetch($parentFolder, $offset = 0, $limit = 10) {
        $files = [];
        $folderName = $this->folderName . "/" . $parentFolder;

        if (!$this->rootFolder->nodeExists($folderName)) {
            return $files;
        }

        $absolutePath = $this->rootFolder->getFullPath($folderName);
        $relativePath = $this->rootFolder->getRelativePath($absolutePath);

        $folder = $this->rootFolder->get($relativePath);
        $nodes = $folder->getDirectoryListing();

        // Sort files by timestamp desc
        usort($nodes, function($node1, $node2) {
            return $node1 -> getMTime() < $node2 -> getMTime();
        });

        // Limit files for pagination
        $nodes = array_slice($nodes, $offset, $limit);

        foreach($nodes as $node) {
            $id = $node->getId();
            $path = "/apps/files/?dir=/" . $folderName . "&openfile=" . $id;
            $name = $node->getName();
            $timestamp = $node -> getMTime();
            $modifiedDate = $this->dateTimeFormatter->formatDateTime($timestamp, "medium");

            $fileInfo = array("path" => $path, "name"=> $name, "modifiedDate" => $modifiedDate);

            array_push($files, $fileInfo);
        }

        return $files;
    }
}
