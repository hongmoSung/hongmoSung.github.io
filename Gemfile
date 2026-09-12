source "https://rubygems.org"

# GitHub Pages 가 서버에서 쓰는 젬 조합을 로컬에서 그대로 재현하기 위한 메타 젬.
# jekyll, kramdown, rouge, jekyll-paginate/sitemap/gist/feed/include-cache 등
# _config.yml 의 plugins 에 나열된 것들은 전부 이 젬이 버전까지 고정해 끌고 온다.
gem "github-pages", group: :jekyll_plugins

gem "webrick"        # Ruby 3+ 에서 jekyll serve 에 필요
gem "faraday-retry"  # jekyll-github-metadata 의 octokit 경고 억제

# Windows/JRuby 전용 (macOS 에서는 설치되지 않음)
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem "wdm", "~> 0.1.1", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
