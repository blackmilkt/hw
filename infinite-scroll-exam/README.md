## FrontEnd HomeWork Test

#### 모바일웹에서 제공되는 간단한 목록 만들기

1. 전달드린 coding_test_api 프로젝트에는 아주 간단한 HTTP API가 포함되어 있습니다. 제공된 API를 사용해서 모바일웹에서 조회 가능한 목록을 만드는 것이 HomeWork 과제입니다. 상세 요구 사항은 다음과 같습니다.
    * API Response 로 주어지는 JSON 내용 중 result 항목의 배열을 모바일웹의 목록으로 표현합니다.
    * 목록의 각 항목은 id, key, uuid, created 값을 포함합니다. 
    * created 항목은 사용자가 인지하기 쉬운 형태로 포맷팅합니다. 
    * 목록을 아래에서 위로 드래그 하면 다음 페이지를 로딩합니다. (무한 스크롤 방식으로 페이징을 구현합니다.)
    * 화면에서 서버에 데이터를 요청하는 동안 화면에는  Loading Indicator 를 노출합니다.
    * 주어진 API 의 Parameter 값은 자유롭게 활용 가능합니다.
        * Page Size 의 값을 자유롭게 조정하고 해당 값을 결정하게 된 이유를 상세히 설명해주세요.
    * Build / Deploy 를 통해 풀이한 내용을 실행해볼 수 있도록 동작 가능한 환경을 구성합니다.
        * 어떠한 방법으로 구현하여도 무관합니다. 다만 제 3자가 코드를 실행 및 확인할 수 있도록 `RESULT.md` 파일에 상세한 설명을 추가합니다.
    * 적절하게 Open Source 등의 3th Party Lib 을 활용하여도 좋지만 직접 구현한 코드가 많을수록 좋은 평가를 받을 가능성이 높습니다.
    * ./views/user.html 에 javascript, html 등 구현 코드를 자유롭게 개발해주시면 됩니다.
    * 풀이과정, 구현의도, 실행방법 등에 대한 설명을 `RESULT.md` 에 기술합니다.
    
2. users API Server 실행 방법
    * npm install  을 통해 dependency module 을 설치합니다. 
    * npm start or node ./bin/www 명령어로 express app 을 실행합니다.
    * npm test 로 test code 를 실행할 수 있습니다.
    * users API 를 통해 간단한 JSON Data를 조회할 수 있습니다.
        * 해당 API에서 사용 가능한 query parameter 는 다음과 같습니다.
            * page : 조회하고자 하는 page number
                * 1 부터 시작되며 전달하지 않는 경우 기본값은 1 입니다.
            * size : 한번에 조회하고자 하는 page size
                * 기본값은 10 입니다. 
            * request example
                * http://localhost:3000/users?page=1&size=10
    * users API 의 응답은 JSON 형태이며 다음과 같은 항목을 가집니다.
        * id : 고유한 id 값으로 1부터 순차적으로 증가합니다.
        * key : 랜덤하게 생성된 String 값 입니다.
        * uuid : key String을 소스로 생성되는 UUID 값 입니다.
        * created : 각 row 가 생성된 시간입니다. (Date.now(): time value in millisecond)
    * 주어진 API 는 불행하게도 매우 느린 속도로 데이터를 조회합니다. (실행환경에 따라 차이가 있을 수 있습니다.)
