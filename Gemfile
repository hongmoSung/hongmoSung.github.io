source "https://rubygems.org"

# GitHub Pages 의 클래식(브랜치) 빌드에서 Actions 빌드로 전환했으므로
# github-pages 메타 젬(= Jekyll 3.10 고정)을 벗어나 Jekyll 을 직접 고정한다.
gem "jekyll", "~> 4.4"
gem "kramdown-parser-gfm"  # Jekyll 4 에서 kramdown 의 input: GFM 을 쓰려면 필요
gem "webrick"              # Ruby 3+ 에서 jekyll serve 에 필요

group :jekyll_plugins do
  gem "jekyll-paginate"
  gem "jekyll-sitemap"
  gem "jekyll-gist"
  gem "jekyll-feed"
  gem "jekyll-include-cache"
end

# Windows/JRuby 전용 (macOS/Linux 에서는 설치되지 않음)
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem "wdm", "~> 0.1.1", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
