// 代码优化版本
var nav = {
  init: function () {
    this.kbdWrapper = this.$('.kbd-wrapper')
    this.prompt = this.$('main .kbd-wrapper .prompt')
    this.textInput = this.$('header .search [type=text]')
    this.reset = this.$('main .kbd-wrapper .reset')
    this.baiduBtn = this.$('#baidu')
    this.gugeBtn = this.$('#guge')
    this.keys = {
      '0': { 0: '1', 1: '2', 2: '3', 3: '4', 4: '5', 5: '6', 6: '7', 7: '8', 8: '9', 9: '0', length: 10 },
      '1': { 0: 'q', 1: 'w', 2: 'e', 3: 'r', 4: 't', 5: 'y', 6: 'u', 7: 'i', 8: 'o', 9: 'p', length: 10 },
      '2': { 0: 'a', 1: 's', 2: 'd', 3: 'f', 4: 'g', 5: 'h', 6: 'j', 7: 'k', 8: 'l', length: 9 },
      '3': { 0: 'z', 1: 'x', 2: 'c', 3: 'v', 4: 'b', 5: 'n', 6: 'm', length: 7 },
      'length': 4
    }
    this.keyHash = {
      '1': 'bilibili.com', 'q': 'qq.com', 'w': 'weibo.com', 'e': 'ele.me', 'r': 'renren.com', 't': 'tudou.com', 'y': 'youku.com', 'u': 'uc.com', 'i': 'iqiyi.com', 'o': 'opera.com', 'p': undefined, 'a': 'acfun.cn', 's': 'sohu.com', 'j': 'jd.com', 'z': 'zhihu.com', 'b': 'baidu.com', 'm': 'www.mcdonalds.com.cn'
    }

    this.lock = false //加锁，防止多次点击开启多个定时器导致混乱，也可以使用函数节流

    this.findReallyKeyHash()
    this.generateKeyboard()
    this.bind()
  },
  bind: function () {
    var _this = this
    document.onkeypress = function (keyInfo) {
      var key = keyInfo['key']
      var website = _this.keyHash[key]
      if (website != undefined && website != '') {
        window.open('http://' + website, target = "_blank")
      } else {
        //加锁，防止多次点击开启多个定时器导致混乱，也可以使用函数节流
        if (!_this.lock) {
          _this.lock = true
          _this.prompt.style.display = 'block';
          setTimeout(function () {
            _this.prompt.style.display = 'none';
            _this.lock = false
          }, 3000)
        }
      }
      // location.href = 'http://' + website
    }

    this.textInput.onkeypress = function (e) {
      //阻止在搜索框中按键也会触发document.onkeypress
      e.stopPropagation();
    }
    this.baiduBtn.onclick = function () {
      var inputText = _this.textInput.value
      window.open('http://www.baidu.com/s?wd=' + inputText, target = "_blank")
    }
    this.gugeBtn.onclick = function () {
      var inputText = _this.textInput.value
      window.open('http://www.google.com/search?q=' + inputText, target = "_blank")
    }
    this.reset.onclick = function () {
      localStorage.removeItem('newHash')
      location.reload();
    }

  },
  generateKeyboard: function () {
    for (var index = 0; index < this.keys['length']; index++) {
      var div = document.createElement('div')
      div.className = 'keysRow'
      this.kbdWrapper.appendChild(div)

      var keysRow = this.keys[index] //第一个数组  第二个数组  第三个数组  第四个数组
      for (var index2 = 0; index2 < keysRow['length']; index2++) {
        var kbd = document.createElement('kbd')
        kbd.innerText = keysRow[index2]

        var icon = this.createIcon(this.keyHash[keysRow[index2]])
        var editBtn = this.createEditBtn(keysRow[index2])

        kbd.appendChild(icon)
        kbd.appendChild(editBtn)

        var _this = this
        kbd.onclick = function (element) {
          var key = element.target.lastChild.id //通过editBtn的id找到key
          var website = _this.keyHash[key]
          if (website != undefined && website != '') {
            window.open('http://' + website, target = "_blank")
          } else {
            //加锁，防止多次点击开启多个定时器导致混乱，也可以使用函数节流
            if (!_this.lock) {
              _this.lock = true
              _this.prompt.style.display = 'block';
              setTimeout(function () {
                _this.prompt.style.display = 'none';
                _this.lock = false
              }, 3000)
            }
          }
        }

        div.appendChild(kbd)
      }
      this.kbdWrapper.appendChild(div)
    }
  },
  createIcon: function (domain) {
    var icon = document.createElement('img')
    if (domain) {
      icon.src = "http://" + domain + '/favicon.ico'
    } else {
      icon.src = ""
    }
    // icon.onerror = function (xxx) {
    //   xxx.target.src = ""
    // }
    return icon
  },
  createEditBtn: function (id) {
    var editBtn = document.createElement('button')
    editBtn.innerText = "编辑"
    editBtn.id = id
    var _this = this
    editBtn.onclick = function (element) {
      //防止点击编辑按钮跳转页面
      element.stopPropagation();
      var currentBtn = element.target
      var currentIcon = currentBtn.previousSibling
      var currentKey = currentBtn.id
      var customURL = prompt("请输入键位[" + currentKey.toUpperCase() + "]所对应的网址")
      if (customURL != null) {
        _this.keyHash[currentKey] = customURL
        // 编辑完了存入localStorage
        localStorage.setItem('newHash', JSON.stringify(_this.keyHash))
        // 编辑完了变更图标
        currentIcon.src = "http://" + customURL + '/favicon.ico'
        // currentIcon.onerror = function (xxx) {
        //   xxx.target.src = ""
        // }
      }
    }
    return editBtn
  },
  findReallyKeyHash: function () {
    var hashInLocalStorage = JSON.parse(localStorage.getItem('newHash') || 'null')
    if (hashInLocalStorage) {
      this.keyHash = hashInLocalStorage
    }
  },
  $: function (val) {
    return document.querySelector(val)
  }
}

nav.init()