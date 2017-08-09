<?php
/*! Felix Sandström 2017 | Unlicensed <http://unlicense.org> */
require('../vendor/autoload.php');

use PhPsst\PhPsst;
use PhPsst\PhPsstException;
use PhPsst\Storage\FileStorage;
use PhPsst\Storage\RedisStorage;
use PhPsst\Storage\SqLiteStorage;

try {
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
    $phPsst = new PhPsst($storage);
    
    if (! empty($_POST['secretKey'])) {
        error_log('[INFO] Retrieving secret');
       echo $phPsst->retrieve($_POST['secretKey']);
    } elseif(!empty($_POST['password'])) {
        $password = $_POST['password'];
        $views = (int) ($_POST['views'] ?: 1);
        $ttl = (int) ($_POST['ttl'] ?: 3600);
        error_log('[INFO] Storing secret');
        echo $phPsst->store($password, $ttl, $views);
    } else {
        http_response_code(400);
        echo 'Bad request';
    }
} catch (PhPsstException $e) {
    switch ($e->getCode()) {
        case PhPsstException::ID_IS_ALREADY_TAKEN:
            http_response_code(500);
            error_log('[INFO] ID already taken');
            echo 'The ID is already taken';
            break;
        case PhPsstException::NO_PASSWORD_WITH_ID_FOUND:
            http_response_code(404);
            error_log('[INFO] No secret with that ID found');
            echo 'No password found for that ID';
            break;
        default:
            http_response_code(500);
            error_log('[INFO] Unknown error: ' . $e->getMessage());
            echo 'Unknown error';
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log($e->getMessage());
    echo 'Unknown error';
}
