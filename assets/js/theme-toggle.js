// 다크모드/라이트모드 전환 기능 
document.addEventListener('DOMContentLoaded', function() {
  // 시스템 테마 감지
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // 초기 테마 설정 - 저장된 테마 또는 시스템 테마 사용
  const savedTheme = localStorage.getItem('theme');
  const currentTheme = savedTheme || getSystemTheme();
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // 테마 토글 함수
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 아이콘 업데이트
    updateToggleIcon(newTheme);
  }
  
  // 테마에 따라 아이콘 업데이트 함수
  function updateToggleIcon(theme) {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      toggleBtn.setAttribute('title', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
    }
  }
  
  // 토글 버튼 생성 및 추가
  function createToggleButton() {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', '테마 전환');
    toggleBtn.onclick = function(e) {
      toggleTheme();
      // 클릭 후 포커스 제거
      setTimeout(function() {
        toggleBtn.blur();
      }, 100);
    };
    
    // 현재 테마에 맞는 아이콘 설정
    const currentTheme = document.documentElement.getAttribute('data-theme');
    toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    toggleBtn.setAttribute('title', currentTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
    
    // 네비게이션 메뉴에 추가
    const masthead = document.querySelector('.masthead__inner-wrap');
    if (masthead) {
      const nav = masthead.querySelector('nav ul.visible-links');
      if (nav) {
        const li = document.createElement('li');
        li.className = 'masthead__menu-item';
        li.appendChild(toggleBtn);
        nav.appendChild(li);
      }
    }
  }
  
  // 시스템 테마 변경 감지
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateToggleIcon(newTheme);
    }
  });
  
  // 버튼 생성
  createToggleButton();
});
