<?php

namespace App\Providers;

use App\Models\SiteColor;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class ColorServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // مشاركة الألوان مع جميع الـ Views
        View::composer('*', function ($view) {
            try {
                $colors = cache()->remember('site_colors', 3600, function () {
                    return SiteColor::getColors();
                });
                $view->with('siteColors', $colors);
            } catch (\Exception $e) {
                $view->with('siteColors', null);
            }
        });
    }
}