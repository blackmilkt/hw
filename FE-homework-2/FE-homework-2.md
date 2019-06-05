# 문제

*정답이 아닐 수도 있음

### 1) 다음과 같이 입력했을때, 아래 결과로 동작 할 수 있도록 소스코드를 작성해 주세요.
"Test".reverse(); // 결과값 -> "tseT"

```javascript
String.prototype.reverse = function() {
  if (!this || typeof this === 'undefined') {
    return '';
  }
  var text = this;
  return text.split('').reverse().join('')
}
console.log("Test".reverse());
```



### 2) 아래와 같이 동작하도록 add 함수를 구현해 주세요.
add(1)(2)(); // 결과값 -> 3

add(1)(2)(3)(4)(); // 결과값 -> 10

```javascript
var add = function(a) {
  return function(b) {
    if (typeof b !== 'undefined') {
      return add(a + b);
    } else {
      return a;
    }
  }
}

console.log(add(1)(2)());
console.log(add(1)(2)(3)(4)());
```


### 3) 다음 셀렉터를 최적화 해 보세요.
$('div#parent .child');

```javascript
 $('#parent').find('.child')
```


### 4) 아래 코드를 콘솔에 0,1,2 가 노출되도록 수정해 주세요.
for(var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  });
}

```javascript
for(var i = 0; i < 3; i++) {
  (function(iValue){
    setTimeout(function() {
      console.log(iValue);
    });
  })(i);
}
```
또는,
```javascript
for(let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  });
}
```
