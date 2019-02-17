<?php
/**
 * @copyright Copyright (c) 2018 Felix Sandström
 * @license   MIT
 */

namespace PhPsstDemo;

use PhPsst\PhPsst;
use PhPsst\PhPsstException;
use PhPsst\Storage\FileStorage;
use PhPsst\Storage\RedisStorage;
use PhPsst\Storage\SqLiteStorage;
use PhPsst\Storage\Storage;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class App
{
    /**
     * @var PhPsst
     */
    private $phPsst;

    public function __construct()
    {
        $this->phPsst = new PhPsst($this->getStorage());
    }

    public function handleRequest(): JsonResponse
    {
        if (!empty($_POST['secretKey'])) {
            $secret = $this->retrieve();
            return new JsonResponse(['success' => true, 'secret' => $secret]);
        }
        if (!empty($_POST['password'])) {
            $secretKey = $this->store();
            return new JsonResponse(['success' => true, 'secretKey' => $secretKey]);
        }

        return new JsonResponse(['success' => false, 'errorMsg' => 'Bad request'], Response::HTTP_BAD_REQUEST);
    }

    public static function handleError(\Exception $exception): JsonResponse
    {
        if ($exception instanceof PhPsstException) {
            switch ($exception->getCode()) {
                case PhPsstException::ID_IS_ALREADY_TAKEN:
                    self::log('[INFO] The ID is already taken');
                    return new JsonResponse(
                        ['success' => false, 'errorMsg' => 'The ID is already taken'],
                        Response::HTTP_INTERNAL_SERVER_ERROR
                    );
                case PhPsstException::NO_PASSWORD_WITH_ID_FOUND:
                    self::log('[INFO] No secret with that ID found');
                    return new JsonResponse(
                        ['success' => false, 'errorMsg' => 'No password found for that ID'],
                        Response::HTTP_NOT_FOUND
                    );
            }
        }

        self::log($exception->getMessage());

        return new JsonResponse(
            ['success' => false, 'errorMsg' => 'Unknown error'],
            Response::HTTP_INTERNAL_SERVER_ERROR
        );
    }

    private function store(): string
    {
        $views = (int)($_POST['views'] ?: 1);
        $ttl = (int)($_POST['ttl'] ?: 3600);
        self::log('[INFO] Storing secret');

        return $this->phPsst->store($_POST['password'], $ttl, $views);
    }

    private function retrieve(): string
    {
        self::log('[INFO] Retrieving secret');

        return $this->phPsst->retrieve($_POST['secretKey']);
    }

    private function getStorage(): Storage
    {
        $dataDir = \dirname(__DIR__) . '/data';
        switch (strtolower(getenv('STORAGE'))) {
            case 'file':
                $storage = new FileStorage($dataDir, 10);
                break;
            case 'redis':
                $storage = new RedisStorage(new \Predis\Client(getenv('REDIS_HOST')));
                break;
            case 'sqlite':
                $storage = new SqLiteStorage(new \SQLite3($dataDir . '/PhPsstStorage.db'), 10);
                break;
            default:
                throw new \RuntimeException('Invalid ENV for STORAGE. Valid values are: File, Redis and SQLite');
        }

        return $storage;
    }

    private static function log(string $message): void
    {
        /** @noinspection ForgottenDebugOutputInspection */
        error_log($message);
    }
}
