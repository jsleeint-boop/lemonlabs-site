// LemonLabs 사이트 설정. 외부 링크와 연락 수단을 이 파일 한 곳에서 관리합니다.
// 값이 비어 있으면("") 해당 버튼은 "준비 중" 안내창을 띄우고, 채워 넣으면 바로 그 주소로 이동합니다.
window.LEMON_CONFIG = {
  email: 'jsleeint@gmail.com',
  phone: '010-8667-5404',
  address: '경기도 수원시 영통구 신원로250번길 53, 영통 아이파크 디어반 1214호',

  // 외부 링크 (스토어, 신청 폼, SNS 등). data-ext="키" 속성이 붙은 링크에 자동으로 연결됩니다.
  links: {
    'lemonori-store': '',   // 예: https://smartstore.naver.com/lemonori
    'naite-apply': '',      // nAIté 수업 신청 폼 (구글 폼 등)
    'naru-apply': '',       // narU 상담 신청 폼
    'instagram': '',        // 예: https://www.instagram.com/lemonlabs
    'youtube': '',
    'blog': '',
    'kakao': ''             // 카카오톡 채널 주소 (예: https://pf.kakao.com/_xxxxx)
  },

  // 문의 폼 전송 방식.
  //  - 비어 있으면: 방문자의 메일 앱이 열리고 입력 내용이 본문에 채워집니다 (서버 불필요).
  //  - Formspree 등 폼 서비스 주소를 넣으면: 해당 주소로 바로 전송합니다. 예: 'https://formspree.io/f/xxxxxxxx'
  formEndpoint: ''
};
