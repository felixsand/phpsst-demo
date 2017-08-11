<?php
/**
 * @copyright Copyright (c) 2017 Felix Sandström
 * @license   MIT
 */
require('../vendor/autoload.php');

use PhPsst\PhPsst;
use PhPsst\PhPsstException;
use PhPsst\Storage\FileStorage;
use PhPsst\Storage\RedisStorage;
use PhPsst\Storage\SqLiteStorage;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

function getPhPsst() {
    $dataDir = dirname(__DIR__) . '/data';
    switch (getenv('STORAGE')) {
        case 'file':
            $storage = new FileStorage($dataDir, 10);
            break;
        case 'redis':
            $storage = new RedisStorage(new \Predis\Client(getenv('REDIS_HOST')));
            break;
        case 'sqLite':
            $storage = new SqLiteStorage(new \SQLite3($dataDir . '/PhPsstStorage.db'), 10);
            break;
        default:
            throw new \RuntimeException('Invalid ENV for STORAGE. Valid values are: file, redis and sqLite');
    }
    return new PhPsst($storage);
}

function store(PhPsst $phPsst) {
    $views = (int) ($_POST['views'] ?: 1);
    $ttl = (int) ($_POST['ttl'] ?: 3600);
    error_log('[INFO] Storing secret');

    return $phPsst->store($_POST['password'], $ttl, $views);
}

function retrieve(PhPsst $phPsst) {
    error_log('[INFO] Retrieving secret');

    return $phPsst->retrieve($_POST['secretKey']);
}

function handleRequest() {
    if (! empty($_POST['secretKey'])) {
        $secret = retrieve(getPhPsst());
        return new JsonResponse(['success' => true, 'secret' => $secret]);
    } elseif(!empty($_POST['password'])) {
        $secretKey = store(getPhPsst());
        return new JsonResponse(['success' => true, 'secretKey' => $secretKey]);
    } else {
        return new JsonResponse(['success' => false, 'errorMsg' => 'Bad request'], Response::HTTP_BAD_REQUEST);
    }
}

function handleError(Exception $exception) {
    if ($exception instanceof PhPsstException) {
        switch ($exception->getCode()) {
            case PhPsstException::ID_IS_ALREADY_TAKEN:
                error_log('[INFO] The ID is already taken');
                return new JsonResponse(
                    ['success' => false, 'errorMsg' => 'The ID is already taken'],
                    Response::HTTP_INTERNAL_SERVER_ERROR
                );
            case PhPsstException::NO_PASSWORD_WITH_ID_FOUND:
                error_log('[INFO] No secret with that ID found');
                return new JsonResponse(
                    ['success' => false, 'errorMsg' => 'No password found for that ID'],
                    Response::HTTP_NOT_FOUND
                );
        }
    }

    error_log($exception->getMessage());
    return new JsonResponse(
        ['success' => false, 'errorMsg' => 'Unknown error'],
        Response::HTTP_INTERNAL_SERVER_ERROR
    );
}

try {
    $response = handleRequest();
} catch (Exception $e) {
    $response = handleError($e);
}

$response->send();
