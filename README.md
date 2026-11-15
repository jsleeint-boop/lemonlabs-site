# LemonLabs 웹사이트

빌드 도구 없이 바로 올릴 수 있는 정적 사이트입니다.

## 파일
- index.html  : 페이지 본문
- style.css   : 스타일 (색상 변수는 맨 위 :root 에 모여 있음)
- script.js   : 테마 전환, 모바일 메뉴, 안내창 (프로젝트 설명 문구는 projects 목록에)
- assets/     : 로고 이미지 (lemon-mark.png, lemon-wordmark.png, lemon-wordmark-dark.png)
- CNAME       : GitHub Pages 사용자 도메인 (www.lemonlabs.co.kr)

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

## 아직 비어 있는 것
- 이용약관 / 개인정보처리방침 / 사업자정보확인 링크 (href="#")
- 세부 서비스 버튼 링크, 협업 문의 버튼 연결
- 사업자정보 보류 항목 (index.html 의 "보류 항목" 주석 참고)
