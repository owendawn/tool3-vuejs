var baseUrlOfThisPage = window.location.origin + window.location.pathname;
if (baseUrlOfThisPage.endsWith("/")) {

} else {
  baseUrlOfThisPage = baseUrlOfThisPage.substring(0, baseUrlOfThisPage.lastIndexOf("/")) + "/"
}

Vue.component("pan-navbar", {
  template: (function () {
    var links = [
      { type: 'link', title: '仰望星空', subtitle: 'Home', url: 'index2.html' },
      { type: 'separator' },
      { type: 'link', title: 'VIP解析', subtitle: 'Vip Parser', url: 'vipparse.html' },
      { type: 'link', title: '磁力转换', subtitle: 'BT Parser', url: 'btparser.html' },
      { type: 'link', title: '问题之书', subtitle: 'Magic Book', url: 'http://pan.is-best.net/iframe.php?' + baseUrlOfThisPage + 'magicbook.html' },
      { type: 'separator' },
      { type: 'link', title: '金融转换', subtitle: 'Finance Parser', url: 'financeparser.html' },
      { type: 'link', title: '经纬转换', subtitle: 'Coordinates Parser', url: 'coordsparser.html' },
      { type: 'separator' },
      { type: 'link', title: '视频转动画', subtitle: 'Video To Gif', url: 'videoToGif.html' },
      { type: 'link', title: '图片灰度转换', subtitle: 'Image To Gray', url: 'imgToGray.html' },
      { type: 'separator' },
      { type: 'link', title: '车辆识别号解析', subtitle: 'Car Code Parser', url: 'carcodeparser.html' },
    ]
    return [
      "<div class='pannav'>",
      '   <nav class="navbar fixed-top navbar-dark bg-dark" style="background-image: linear-gradient(rgb(24 50 58), rgb(103 108 126));opacity: 0.95;">',
      '     <div class="container-fluid">',
      '       <a class="navbar-brand" href="#"><i class="fa fa-home"></i></a>',
      '       <form class="d-flex">',
      '         <button @click="toggleMenu" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">',
      '           <span class="navbar-toggler-icon"></span>',
      '         </button>',
      '       </form>',
      '     </div>',
      '   </nav>',
      '   <div v-show="showMenu"',
      '       style="display:none;box-shadow: rgba(96, 93, 93, 0.5) -5px -1px 5px;overflow: auto;width:100%;height: 100%;position: fixed;right: 0;z-index: 9999;top: 0;">',
      '       <div @click="toggleMenu" style="background: rgba(0, 0, 0, 0.7);height: 100%;position: absolute;top: 0px;width: 100%;z-index:-1;"></div>',
      '       <div style="max-width: 360px;width: 70%;height:100%;background-color: rgb(248, 248, 248);float:right;overflow:auto;" >',
      '           <div style="text-align: center;font-weight: bolder;font-size: 2rem;padding: 34px 0;background-color: white;">- UV -</div>',
      '           <ul class="list-group">',
      links.map(function (it, idx, all) {
        switch (it.type) {
          case 'link': {
            return [
              '<li class="list-group-item">',
              ' <a href="' + it.url + '" style="display: block;text-decoration: none;color: black;">',
              '   ' + it.title,
              '   <span class="float-right text-secondary">' + it.subtitle + ' <i class="fa fa-angle-right"></i></span>',
              ' </a>',
              '</li>'
            ].join("");
          }
          case 'separator': {
            return '<li class="list-group-item" style="background-image:linear-gradient(180deg,#d9d9d9,#d9d9d9 100%,transparent 0);padding:2px;"></li>';
          }
          default: {
            return '';
          }
        }
      }).join(""),
      '         </ul>',
      "       </div>",
      "   </div>",
      "</div>",
    ].join("")
  })(this),
  props: ['title'],
  data() {
    return {
      showMenu: false,

    }
  },
  methods: {
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
