## Precondition
```
npm istall
```
* 개발, 빌드 및 Server 실행을 위해 필요한 Dependencies 인스톨

## Development Mode
```
npm start
```
* API Server 실행

```
npm run dev
```
* 새로운 터미널에서 개발 서버(webpack-dev-server) 실행
* http://localhost:3333/users/view 페이지 자동 오픈

## Production Build
```
npm run build
```
* [/public] 아래에 압축된 [/js/user.min.js], [/stylesheets/user.min.css]를 생성
* [/views/user.html] 뷰에서 결과물 사용

## Server Start & View Result
```
npm start
```
* http://localhost:3000/users/view (Homework 결과 화면)

## Implementation
1.  요구 사항 정리 
    * 사용자는 User API 호출하여 가져온 결과를 화면에서 목록으로 볼 수 있다.
    * 사용자는 목록에서 각 User의 id, key, uuid, created 항목을 확인할 수 있다.
    * 사용자는 User의 포맷화된 created 시간을 확인할 수 있다.
    * 사용자는 해당 목록의 마지막에 다다랐을 때, 다음 페이지의 데이터를 볼 수 있다.
    * 사용자는 목록을 호출하는 동안 Loading Indicator를 볼 수 있다.
    <br><br>
2.  API Server 환경 파악 및 클라이언트 개발/빌드 환경 셋업
    * [Package.json] : 구현에 필요한 Dependencies 추가 및 인스톨
    * Webpack configuration
      * [webpack.config.js] : 개발용
      * [webpack.build.config.js] : 빌드용
    * 클라이언트 개발 소스
      * [/src] : 개발 환경에서 사용할 User View 템플릿 및 화면 구현에 필요한 리소스
      * [/src/components] : 화면에 렌더링 될 컴포넌트 정의
      * [/src/less] : 공통 Less 스타일 정의
    <br><br>
3.  Development Build 환경에서 API Server 접근 및 응답 결과 확인
    * Dev Server의 포트는 3333으로 API Server 호출 시 "HTTP Status 404" 이슈 발생
    * Dev server에 Proxy 설정을 추가하여 `//localhost:3333/users`으로 호출하여도 `//localhost:3000/users`에 접근할 수 있도록 함
    <br><br>
4.  클라이언트 화면 구성 계획
    * Header : 페이지의 타이틀
    * Section : Users List 컴포넌트를 보여줄 영역
        * List empty : 리스트 결과가 없는 경우 노출
        * User list : 결과 목록
          * User item : 결과 개수만큼 반복될 아이템
        * List indicator : API 응답 완료 전까지 노출
        * List error : 리스트 결과 호출 시 문제가 발생한 경우 노출
    <br><br>
5.  요구사항에 따른 기능 구현
    * UsersList [/src/UsersList.js]
      ```javascript
      constructor(props) {
        ...
        this.state = {
          page: 0, //현재 페이지
          list: [], //목록 결과를 저장
          isAPILoading: false, //API 서버 호출 완료 여부
          isError: false //API 서버 호출 이슈 발생 여부, true인 경우 Reload 할 수 있도록 버튼을 추가 
        };
        ...
        this.size = 20; //페이지당 호출할 데이터 사이즈
      }
      ```
      * 컴포넌트에서 필요한 상태 정보 및 값을 초기화한다.
      * 페이지당 호출할 데이터 사이즈는 UserItem 컴포넌트의 Height과 추측 가능한 가장 큰 모바일 기기의 Height을 계산하여 결정하였다.
      * 하나의 UserItem Height은 `130px`, 아이패드 프로에서 화면을 로딩할 경우 전체 화면의 Height은 `1366px`으로 한 페이지에서 약 10개의 아이템을 보여 줄 수 있어 기준 사이즈를 10으로 정하고, 2배의 데이터를 가져올 수 있도록 하였다.
      <br><br>
      
      ```javascript
      componentDidMount() {
        this.callList(1);
        window.addEventListener('scroll', this.toRequestAniFrame(this.handleScroll));
      }
      ```
      * 컴포넌트가 화면에 마운트 되었을 때, 첫번째 페이지 목록을 호출하고 스크롤 이벤트 리스너를 추가한다.
      * Scroll 이벤트 발생 시 API 호출의 순차적 처리를 위하여 `requestAnimationFrame()` 메소드를 호출하기 위해 생성한 함수 `toRequestAniFrame()`를 인자로 넘겨주었다.
      * `requestAnimationFrame()` 메소드는 브라우저 렌더링 능력에 맞게 이벤트를 트리거 한다.
      <br><br>
      ```javascript
      toRequestAniFrame = (run) => {
        if (!run) {
          throw Error('Invalid required arguments');
        }
    
        let isReady = false;
    
        return () => {
          if (isReady) return;
    
          isReady = true;
          return requestAnimationFrame(() => {
            isReady = false;
            return run();
          });
        }
      }
      ```
      * 스크롤 했을 때 실행할 함수를 인자로 받는다.
      * `isReady` 값은 리턴되는 함수에서 참조하는 변수로 브라우저의 렌더링 가능 능력 이상의 호출을 방지한다.
      * `requestAnimationFrame()`에서 받은 콜백이 실행 되기 전까지는 `isReady` 값이 `true`가 되지 않아 인자로 넘겨 받은 `handleScroll()`이 동작하지 않는다.
      <br><br>
      ```javascript
      handleScroll = () => {
        ...
        if (isError || isAPILoading) return;
        ...
        if (currentScrollBottom >= scrollHeight - 70) {
          this.callList(this.state.page + 1);
        }
      }
      ```
      * 스크롤 될 남은 영역이 70px 이하로 감소하게 되면 API 호출을 시도한다.
      * 70px은 Loading Indicator의 Height 이다.
      * 이때, API 호출에 문제가 발생된 상태이거나 응답을 기다리는 상태면 목록 호출을 하지 않도록 한다.
      <br><br>

      ```javascript
      callList = (currentPage) => {
        ...
        axios.get(this.url, {
          params: {
            page: currentPage,
            size: this.size
          }
        })
          .then((response) => {
            ...
            this.setState({
              list: mergedList,
              page: data.page,
              isAPILoading: false
            })
          }, (errors) => {
            ...
          });
      }
      ```
      * 호출해야 할 페이지 `currentPage` 값을 받아 API를 호출한다. 호출에 성공하면 현재 상태의 페이지 값을 `state`에 업데이트한다.
      * 기존 목록과 응답으로 받은 결과 목록을 합친 리스트를 `state`에 업데이트 한다. 새로 추가된 목록만 렌더링된다.
      * API 호출이 완료 되면 `isAPILoading` 값은 `false`로 업데이트 한다. Error가 발생 하더라도 해당 값은 `false`로 변경해준다. 
      <br><br>
      
    * UserItem [/src/components/UerItem.js]
      ```javascript
      formattedDate = (utc) => {
        let dateValue = new Date(utc);
        if (this.isValidDate(dateValue)) {
          return dateValue.format();
        }
        return '';
      }
      ```
      * UTC 날짜 값을 인자로 받아서 "yyyy-MM-dd tt h:mm.sss" 포맷으로 리턴한다.
      * `Date`의 `prototype`에 `format()`을 정의하였다. - [/src/user.js]
        ```javascript
        Date.prototype.format = function() {
          if (!this || !this.valueOf()) return '';
          const d = this;
          
          let month = d.getMonth();
          let date = d.getDate();
          month = ((month < 10)? '0' + month : month);
          date = ((date < 10)? '0' + date : date);
          const fullDate = [d.getFullYear(), month, date].join('-');
          
          let hours = d.getHours();
          let minutes = d.getMinutes();
          const milli = d.getMilliseconds();
          const ampm = (hours >= 12)? 'pm' : 'am';
          hours = hours % 12;
          hours = (hours)? hours : 12;
          minutes = (minutes < 10)? '0' + minutes : minutes;
          const time = [hours, minutes].join(':')
          
          return fullDate + ' ' + ampm.toUpperCase()+ ' ' + time + '.' + milli;
        };
        ```
    <br>
6. Production Build
