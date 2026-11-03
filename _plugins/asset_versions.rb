# frozen_string_literal: true

require "digest"

# SCSS와 Liquid JS의 변환이 모두 끝난 뒤 실제 배포 내용으로 버전을 계산한다.
# 매 빌드마다 다시 계산하므로 jekyll serve에서도 수정한 파일이 반영된다.
Jekyll::Hooks.register :site, :post_render do |site|
  versions = {}
  baseurl = site.baseurl.to_s.chomp("/")

  site.static_files.each do |file|
    next unless file.relative_path.match?(/\.(?:css|js)\z/)

    versions[baseurl + file.url] = Digest::SHA256.file(file.path).hexdigest[0, 16]
  end

  documents = site.pages + site.collections.values.flat_map(&:docs)
  documents.each do |document|
    next unless document.output_ext.match?(/\A\.(?:css|js)\z/)

    versions[baseurl + document.url] = Digest::SHA256.hexdigest(document.output)[0, 16]
  end

  documents.each do |document|
    next unless document.output_ext == ".html"

    document.output = document.output.gsub(/<(?:link|script)\b[^>]*>/i) do |tag|
      tag.gsub(/\b(href|src)=(["'])([^"']+)\2/) do |attribute|
        name, quote, url = Regexp.last_match.captures
        version = versions[url]
        version ? "#{name}=#{quote}#{url}?v=#{version}#{quote}" : attribute
      end
    end
  end
end
