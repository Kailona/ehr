<?php

return ['routes' => [
    // Client Pages
    ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],

    // API Endpoints
    ['name' => 'mail#requestdata', 'url' => '/mail/requestdata', 'verb' => 'POST'],
    ['name' => 'settings#admin', 'url' => '/settings/admin', 'verb' => 'POST'],
    ['name' => 'fhir#transaction', 'url' => '/fhir', 'verb' => 'POST'],
    ['name' => 'fhir#create', 'url' => '/fhir/{type}', 'verb' => 'POST'],
    ['name' => 'fhir#read', 'url' => '/fhir/{type}/{id}', 'verb' => 'GET'],
    ['name' => 'fhir#vread', 'url' => '/fhir/{type}/{id}/_history/{vid}', 'verb' => 'GET'],
    ['name' => 'fhir#update', 'url' => '/fhir/{type}/{id}', 'verb' => 'PUT'],
    ['name' => 'fhir#patch', 'url' => '/fhir/{type}/{id}', 'verb' => 'PATCH'],
    ['name' => 'fhir#delete', 'url' => '/fhir/{type}/{id}', 'verb' => 'DELETE'],
    ['name' => 'fhir#history', 'url' => '/fhir/{type}/{id}/_history', 'verb' => 'GET'],
    ['name' => 'fhir#search', 'url' => '/fhir/{type}', 'verb' => 'GET'],
    ['name' => 'documents#import', 'url' => '/documents/import', 'verb' => 'POST'],
    ['name' => 'documents#fetch', 'url' => '/documents/fetch', 'verb' => 'POST'],
]];
