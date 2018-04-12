function $(val) {
  return document.querySelector(val)
}
function $$(val) {
  return document.querySelectorAll(val)
}

$('#baidu').onclick = function () {
  var inputText = $('[type=text]').value
  window.open('http://www.baidu.com/s?wd=' + inputText, target = "_blank")
}
$('#guge').onclick = function () {
  var inputText = $('[type=text]').value
  window.open('http://www.google.com/search?q=' + inputText, target = "_blank")
}
var lock = false
var keys = {
  '0': { 0: '1', 1: '2', 2: '3', 3: '4', 4: '5', 5: '6', 6: '7', 7: '8', 8: '9', 9: '0', length: 10 },
  '1': { 0: 'q', 1: 'w', 2: 'e', 3: 'r', 4: 't', 5: 'y', 6: 'u', 7: 'i', 8: 'o', 9: 'p', length: 10 },
  '2': { 0: 'a', 1: 's', 2: 'd', 3: 'f', 4: 'g', 5: 'h', 6: 'j', 7: 'k', 8: 'l', length: 9 },
  '3': { 0: 'z', 1: 'x', 2: 'c', 3: 'v', 4: 'b', 5: 'n', 6: 'm', length: 7 },
  'length': 4
}

var hash = {
  '1': 'bilibili.com', 'q': 'qq.com', 'w': 'weibo.com', 'e': 'ele.me', 'r': 'renren.com', 't': 'tudou.com', 'y': 'youku.com', 'u': 'uc.com', 'i': 'iqiyi.com', 'o': 'opera.com', 'p': undefined, 'a': 'acfun.cn', 's': 'sohu.com', 'j': 'jd.com', 'z': 'zhihu.com',  'b': 'baidu.com', 'm': 'www.mcdonalds.com.cn'
}
var hashInLocalStorage = JSON.parse(localStorage.getItem('newHash') || 'null')
if(hashInLocalStorage){
  hash = hashInLocalStorage
}

for(var index = 0; index < keys['length']; index++) {
  var div = document.createElement('div')
  var row = keys[index]
  for(var index2 = 0; index2 < row['length']; index2++) {
    var kbd = document.createElement('kbd')
    kbd.innerText = row[index2]
    //获取网页图标
    var icon = document.createElement('img')
    if(hash[row[index2]]){
      icon.src = "http://" +  hash[row[index2]] + '/favicon.ico'
    } else {
      icon.src = ""
    }
    var editBnt = document.createElement('button')
    editBnt.innerText = "编辑"
    editBnt.id = row[index2]

    editBnt.onclick = function(element){
      //防止点击编辑按钮跳转页面
      element.stopPropagation();
      var currentBtn = element.target
      var key = currentBtn.id
      var customURL = prompt("请输入键位[" + key.toUpperCase() + "]所对应的网址")
      if(customURL != null){
        hash[key] = customURL
        localStorage.setItem('newHash', JSON.stringify(hash))
        currentBtn.previousSibling.src = "http://" +  customURL + '/favicon.ico'
      }
    }
    kbd.appendChild(icon)
    kbd.appendChild(editBnt)
    kbd.onclick = function(element){
      var key = element.target.lastChild.id
      var website = hash[key]
      if(website != undefined && website != '') {
        window.open('http://' + website, target="_blank")
      } else {
        //加锁，防止多次点击开启多个定时器导致混乱，也可以使用函数节流
        if(!lock){
          lock = true
          $('main .kbd-wrapper .prompt').style.display = 'block';
          setTimeout(function(){
            $('main .kbd-wrapper .prompt').style.display = 'none';
            lock = false
          }, 3000)
        }
      }
    }
    div.appendChild(kbd)
  }
  $('.kbd-wrapper').appendChild(div)
}

document.onkeypress = function(keyInfo){
  var key = keyInfo['key']
  var website = hash[key]
  if(website != undefined && website != '') {
    window.open('http://' + website, target="_blank")
  } else {
    //加锁，防止多次点击开启多个定时器导致混乱，也可以使用函数节流
    if(!lock){
      lock = true
      $('main .kbd-wrapper .prompt').style.display = 'block';
      setTimeout(function(){
        $('main .kbd-wrapper .prompt').style.display = 'none';
        lock = false
      }, 3000)
    }
  }
  // location.href = 'http://' + website

}

$('header .search [type=text]').onkeypress = function(e){
  //阻止在搜索框中按键也会触发document.onkeypress
  e.stopPropagation();
}

$('main .kbd-wrapper .reset').onclick = function(){
  localStorage.removeItem('newHash')
  location.reload();
}