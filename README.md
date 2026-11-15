# LemonLabs 웹사이트

빌드 도구 없이 바로 올릴 수 있는 정적 사이트입니다.

## 사이트 구조
```
/                  index.html        랜딩 (허브). 모든 버튼이 아래 페이지로 연결됩니다.
/naite/            nAIté 나이테      AI 교육  — #class 초중등 클래스 · #iot IoT 클래스 · #metacognition 메타인지 테스트
/naru/             narU 나루         대학 진학 — #essay 나루논술연구소 · #scc 나루크루즈캠프 SCC
/lemonori/         LEMONori 레몬놀이  놀이 브랜드 — #products 제품 라인 · #store 레몬놀이스토어
/lab/              Open Lab          접근법 · 프로세스 · 랩 노트 · 협업 방법
/contact/          Contact           이메일 · 전화 · 지도 · 문의 폼 (?topic=naite|naru|lemonori|lab 로 유형 사전 선택)
/legal/terms.html  이용약관 (초안)
/legal/privacy.html 개인정보처리방침 (초안)
404.html           없는 주소로 들어왔을 때 (GitHub Pages가 자동으로 사용)
sitemap.xml, robots.txt
```

연결 흐름: 랜딩 히어로 스티커 / 프로젝트 카드 / 프로그램 칩 → 각 브랜드 페이지(및 섹션 앵커) → 페이지 안의 모든 CTA → `/contact/?topic=…` → 폼 유형이 미리 선택됨.
각 서브 페이지 하단의 "MORE FROM LEMONLABS" 줄로 다른 브랜드로 건너갈 수 있습니다.

## 파일
- index.html        : 랜딩 페이지
- naite/ naru/ lemonori/ lab/ contact/ legal/ : 서브 페이지 (각 폴더의 index.html)
- style.css         : 공통 스타일 (색상 변수는 맨 위 :root 에 모여 있음)
- pages.css         : 서브 페이지 전용 스타일. 브랜드별 색은 맨 위 `body[data-brand=…]` 에 모여 있음
- config.js         : **외부 링크와 연락 설정을 한 곳에서 관리** (아래 참고)
- script.js         : 테마 전환, 모바일 메뉴, 외부 링크 연결, 문의 폼, 스크롤 등장 효과
- assets/           : 로고 이미지
- CNAME             : GitHub Pages 사용자 도메인 (www.lemonlabs.co.kr)

## 링크 연결하기 (config.js)
`config.js` 의 `links` 에 주소를 넣으면 해당 버튼이 바로 연결됩니다. 비어 있는 동안은 버튼에 `SOON` 배지가 붙고 클릭 시 "준비 중" 안내창이 뜹니다.

| 키 | 연결되는 버튼 |
|---|---|
| `lemonori-store` | 레몬놀이스토어 바로가기 (LEMONori 페이지 히어로, 제품 카드, 스토어 배너) |
| `naite-apply`, `naru-apply` | 신청 폼이 생기면 각 페이지의 CTA 에 `data-ext="naite-apply"` 를 붙여 사용 |
| `kakao`, `instagram`, `youtube`, `blog` | Contact 페이지 채널 카드 (비어 있으면 카드 자체가 숨겨짐) |

문의 폼은 `formEndpoint` 가 비어 있으면 방문자의 메일 앱을 열어 내용을 채워 줍니다(서버 불필요). Formspree 같은 폼 서비스 주소를 넣으면 그 주소로 바로 전송됩니다.

## 새 서브 페이지 추가하기
1. 기존 폴더(예: `naru/`)를 복사해 이름을 바꿉니다.
2. `<body data-brand="…">` 값을 정하고 `pages.css` 맨 위에 그 브랜드의 색 변수를 한 줄 추가합니다.
3. 모든 페이지의 헤더 `desktop-nav` / `mobile-nav` 와 하단 `siblings` 에 링크를 추가합니다.
4. `sitemap.xml` 에 주소를 추가합니다.

## 배포 (GitHub Pages 기준)
1. 이 폴더의 내용을 저장소 루트에 올립니다.
2. Settings > Pages 에서 Branch: main, Folder: / (root) 선택.
3. 도메인 관리 화면(DNS)에 아래 레코드를 추가합니다.
   - CNAME  www              -> <깃허브아이디>.github.io
   - A      @ (lemonlabs.co.kr) -> 185.199.108.153
   - A      @                 -> 185.199.109.153
   - A      @                 -> 185.199.110.153
   - A      @                 -> 185.199.111.153
4. DNS 반영 후 Settings > Pages 에서 Enforce HTTPS 체크.

Netlify / Cloudflare Pages 등 다른 정적 호스팅도 폴더 그대로 올리면 됩니다.
(CNAME 파일은 GitHub Pages 전용이며 다른 호스팅에서는 무시됩니다.)

## 공개 전 확인할 것
- `config.js` 의 스토어 · SNS 링크, 필요하면 `formEndpoint`
- 각 프로그램 카드의 대상 · 일정 · 장소 문구 (현재는 "상세 문의" 수준의 안내 문구)
- `legal/` 의 약관 · 개인정보처리방침: 초안이므로 시행일을 채우고 내용을 검토한 뒤 `DRAFT` 배지를 제거
- 사업자정보확인 링크 (사업자등록번호 확정 후 `https://www.ftc.go.kr/bizCommPop.do?wrkr_no=번호` 로 연결)
- 사업자정보 보류 항목 (index.html 의 "보류 항목" 주석 참고)
