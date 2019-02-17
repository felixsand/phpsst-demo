<?php

require '../vendor/autoload.php';

header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
try {
    $app = new \PhPsstDemo\App();
    $response = $app->handleRequest();
} catch (\Exception $exception) {
    $response = \PhPsstDemo\App::handleError($exception);
}
$response->send();
