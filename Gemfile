source "https://rubygems.org"

# GitHub Pages에서 사용하는 의존성과 버전을 맞추기 위해
gem "github-pages", group: :jekyll_plugins
gem "webrick" # 로컬 호스팅을 위한 필요 Gem
gem "faraday-retry"
gem "minimal-mistakes-jekyll"

group :jekyll_plugins do
  gem "jekyll-paginate"
  gem "jekyll-sitemap"
  gem "jekyll-gist"
  gem "jekyll-feed"
  gem "jekyll-include-cache"
  gem "jekyll-remote-theme"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", platforms: [:mingw, :mswin, :x64_mingw, :jruby]