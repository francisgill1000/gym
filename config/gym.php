<?php

return [
    'name'     => env('GYM_NAME', 'Forge Fitness'),
    'location' => env('GYM_LOCATION', 'Business Bay, Dubai'),
    'timezone' => env('GYM_TZ', 'Asia/Dubai'),
    'currency' => env('GYM_CURRENCY', 'AED'),
    'capacity' => (int) env('GYM_CAPACITY', 180),
];
