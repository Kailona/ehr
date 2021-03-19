<?php

namespace OCA\EHR\Service;

use OCP\Files\Folder;
use OCP\Files\Node;
use OCP\IDateTimeFormatter;
use OCP\ILogger;

class DocumentsService
{
    public function __construct(Folder $rootFolder, IDateTimeFormatter $dateTimeFormatter, ILogger $logger)
    {
       $this->rootFolder = $rootFolder;
       $this->dateTimeFormatter = $dateTimeFormatter;
       $this->logger = $logger;
       $this->folderName = "KailonaDocuments";
    }

    public function import($file, $parent) {
        $parentFolder =  $this->folderName . "/" .$parent;
        $fileName = $parentFolder . "/" . $file['name'];

        $content = fopen($file['tmp_name'], 'rb');
        if ($content === false) {
            throw new Exception($fileName .' failed to read file.');
        }

        if (!$this->rootFolder->nodeExists($this->folderName)) {
            $this->rootFolder->newFolder($this->folderName);
            $this->logger->info($this->folderName .' folder created.');
        }

        if (!$this->rootFolder->nodeExists($parentFolder)) {
            $this->rootFolder->newFolder($parentFolder);
            $this->logger->info($parentFolder . 'parent folder created.');
        }

        if ($this->rootFolder->nodeExists($fileName)) {
            $target = $this->rootFolder->get($fileName);
            $this->logger->info($fileName .' file exists.');
        } else {
            $this->logger->info($fileName .' file created.');
            $target = $this->rootFolder->newFile($fileName);
        }

        $target->fopen('w');
        $target->putContent($content);
    }

    public function fetch($parentFolder) {
        $files = [];
        $folderName = $this->folderName . "/" . $parentFolder;

        if (!$this->rootFolder->nodeExists($folderName)) {
            return $files;
        }

        $absolutePath = $this->rootFolder->getFullPath($folderName);
        $relativePath = $this->rootFolder->getRelativePath($absolutePath);

        $folder = $this->rootFolder->get($relativePath);
        $nodes = $folder->getDirectoryListing();
        foreach($nodes as $node) {
            $id = $node->getId();
            $path = "/apps/files/?dir=/" . $folderName . "&openfile=" . $id;
            $name = $node->getName();
            $timestamp = $node -> getMTime();
            $modifiedDate = $this->dateTimeFormatter->formatDate($timestamp, "medium");
            $fileInfo = array("path" => $path, "name"=> $name, "modifiedDate" => $modifiedDate);
            array_push($files, $fileInfo);
        }

        return $files;
    }
}