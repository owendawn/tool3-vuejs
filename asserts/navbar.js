var baseUrlOfThisPage = window.location.origin + window.location.pathname;
if (baseUrlOfThisPage.endsWith("/")) {

} else {
  baseUrlOfThisPage = baseUrlOfThisPage.substring(0, baseUrlOfThisPage.lastIndexOf("/")) + "/"
}

Vue.component("pan-navbar", {
  template: (function () {
    console.log(this);

    var links = [
      { type: 'link', title: '仰望星空', subtitle: 'Home', url: 'index2.html' },
      { type: 'separator' },
      { type: 'link', title: 'VIP解析', subtitle: 'Vip Parser', url: 'vipparse.html' },
      { type: 'link', title: '磁力转换', subtitle: 'BT Parser', url: 'btparser.html' },
      { type: 'link', title: '问题之书', subtitle: 'Magic Book', url: PanConfig.URL_ROOT + '/iframe.php?' + baseUrlOfThisPage + 'magicbook.html#' },
      // { type: 'link', title: '问题之书', subtitle: 'Magic Book', url: 'magicbook.html#' },
      { type: 'separator' },
      { type: 'link', title: '个税速算', subtitle: 'Payroll Tax', url: 'payrollTax.html' },
      { type: 'link', title: '金融转换', subtitle: 'Finance Parser', url: 'financeparser.html' },
      { type: 'link', title: '经纬转换', subtitle: 'Coordinates Parser', url: 'coordsparser.html' },
      { type: 'link', title: '坐标拾取', subtitle: 'Coordinates Picker', url: 'coordsPicker.html' },
      { type: 'separator' },
      { type: 'link', title: '二维码生成', subtitle: 'QRCode Parser', url: 'qrcodeparser.html' },
      { type: 'link', title: '视频转动画', subtitle: 'Video To Gif', url: 'videoToGif.html' },
      { type: 'link', title: '图片灰度转换', subtitle: 'Image To Gray', url: 'imgToGray.html' },
      { type: 'link', title: '图片转字符画', subtitle: 'Image To Words', url: 'imgToWord.html' },
      { type: 'separator' },
      { type: 'link', title: '车辆识别号解析', subtitle: 'Car Code Parser', url: 'carcodeparser.html' },
    ]
    return [
      "<div class='pannav'>",
      '   <nav class="navbar is-primary" role="navigation" aria-label="main navigation">',
      '       <div class="navbar-brand">',
      '           <a class="navbar-item" href="index2.html"><i class="fa fa-home"></i>&emsp;{{this.title}}</a>',
      '           <a role="button" class="navbar-burger"  :class="{\'is-active\':showMenu}" @click="toggleMenu" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">',
      '               <span aria-hidden="true"></span>',
      '               <span aria-hidden="true"></span>',
      '               <span aria-hidden="true"></span>',
      '               <span aria-hidden="true"></span>',
      '           </a>',
      '       </div>',
      '       <div id="navbarBasicExample" class="navbar-menu" :class="{\'is-active\':showMenu}">',
      '           <div class="navbar-start">',
      '               <a class="navbar-item" href="index2.html">首页</a>',
      '               <div class="navbar-item has-dropdown is-hoverable">',
      '                   <a class="navbar-link">百宝箱</a>',
      '                   <div class="navbar-dropdown">',
      // '                       <a class="navbar-item">About</a>',
      // '                       <a class="navbar-item is-selected">Jobs</a>',
      // '                       <a class="navbar-item">Contact</a>',
      // '                       <hr class="navbar-divider">',
      // '                       <a class="navbar-item">Report an issue</a>',
      links.map(function (it, idx, all) {
        switch (it.type) {
          case 'link': {
            return [
              ' <a class="navbar-item" :class="{\'is-selected\':isChooseMenu(\'' + it.title + '\')}" href="' + it.url + '" >',
              '   <span v-html="fillTitle(\'' + it.title + '\')"></span>',
              '   <span class="float-right text-secondary">' + it.subtitle + ' <i class="fa fa-angle-right"></i></span>',
              ' </a>',
            ].join("");
          }
          case 'separator': {
            return '<hr class="navbar-divider">';
          }
          default: {
            return '';
          }
        }
      }).join(""),
      '                   </div>',
      '               </div>',
      '           </div>',
      '           <div class="navbar-end">',
      '               <div class="navbar-item">',
      '                   <div class="buttons">',
      // '                       <a class="button is-primary"><strong>^v^</strong></a>',
      '                       <a class="button is-dark is-success">^v^</a>',
      '                   </div>',
      '               </div>',
      '           </div>',
      '       </div>',
      '   </nav > ',
      "</div>",
    ].join("")
  })(this),
  props: ['title'],
  data() {
    return {
      showMenu: false,

    }
  },
  mounted() {
    if (top.location != location) {
      document.querySelectorAll('a').forEach((it) => {
        var that = this;
        it.onclick = function (e) {
          e.preventDefault();
          that.iframePostMessage("href",
            it.href,
            null, (re) => {

            });
        }
      })
    }
  },
  methods: {
    isChooseMenu(title) {
      return this.title === title
    },
    fillTitle(title) {
      var maxTitleLength = 7
      var enCnt=this.countEnglishLetters(title)
      for (i = title.length; i < maxTitleLength; i++) {
        title += '&emsp;'
      }
      for (i = 0; i < enCnt; i++) {
        title += '&nbsp;'
      }
      return title
    },
    countEnglishLetters(str) {
      const englishLetters = str.match(/[a-zA-Z0-9]/g);
      return englishLetters ? englishLetters.length : 0;
    },
    iframePostMessage(type, url, data, succ) {
      var cfn = "paniframe_" + new Date().getTime();
      var _call = function (e) {
        var data = JSON.parse(e.data)
        // console.log(data)
        if (data.type === "PanIframe" && data.paniframeid === cfn) {
          succ(data.result, data)
          window.removeEventListener("message", _call);
        }
      }
      window.addEventListener("message", _call, false);
      window.parent.postMessage(JSON.stringify({
        type: "PanIframe",
        paniframeid: cfn,
        url: url,
        method: type,
        data: data
      }), '*');
    },
    goBack() {
      window.location.href = "index.html"
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
      console.log(this.showMenu)
    },
    doNothing(e) {
      this.showMenu = true;
    }
  }
});
