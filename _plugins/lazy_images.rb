# frozen_string_literal: true

# 본문 이미지에 loading="lazy" / decoding="async" 를 붙인다.
#
# 글이 전부 마크다운이라 kramdown 이 뱉는 <img> 에 속성을 넣을 방법이 없고,
# 글마다 IAL({: loading="lazy"})을 다는 것도 유지가 안 된다. 그래서 변환 직후
# 본문 HTML 에 일괄 적용한다.
#
# :post_convert 는 레이아웃을 씌우기 전 본문(document.content)만 다루므로
# 사이드바 아바타처럼 첫 화면에 바로 보이는 테마 이미지는 eager 로 남는다.
# Jekyll 4.4 renderer.rb 는 이 훅 직후 document.content 를 다시 읽어가므로
# 여기서 고친 내용이 최종 출력까지 전달된다.
#
# 코드블록 안의 <img> 예시는 kramdown 이 &lt;img 로 이스케이프하기 때문에
# 이 정규식에 걸리지 않는다.
#
# HTML 로 출력되는 문서에만 적용한다. 테마의 assets/js/lunr/lunr-*.js 처럼
# front matter 가 붙어 Jekyll page 로 처리되는 JS 파일에도 문자열 리터럴로
# <img ...> 가 들어 있어서, 한정하지 않으면 JS 까지 건드리게 된다.
module LazyImages
  ATTRS = 'loading="lazy" decoding="async" '

  # 이미 loading= 이 붙어 있는 태그는 건너뛴다 (글에서 직접 지정한 경우 존중).
  PATTERN = /<img\s+(?![^>]*\bloading=)/

  def self.apply(content)
    return content unless content.is_a?(String) && content.include?("<img")

    content.gsub(PATTERN, "<img #{ATTRS}")
  end
end

Jekyll::Hooks.register %i[documents pages], :post_convert do |doc|
  next unless doc.output_ext == ".html"

  doc.content = LazyImages.apply(doc.content)
end
