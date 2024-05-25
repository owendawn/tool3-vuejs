var PanToast = {
    alert: function (msg, alertClass, delay) {
        var id = 'alert' + new Date().getTime()
        var html = [
            '<div id="' + id + '" style="position: absolute;top: 4rem;left: 40%;"',
            '   class="toast d-flex align-items-center text-white border-0" role="alert" aria-live="assertive" aria-atomic="true">',
            '   <div class="toast-body"  style="padding:0;">',
            '       <div class="mb-0 alert '+(alertClass||'alert-secondary')+'" role="alert">',
                        msg,
                        ' <button type="button" class="btn-close" data-dismiss="toast" aria-label="Close" ' +
                        'onClick="new bootstrap.Toast(document.getElementById(\''+id+'\')).hide()"></button>',
            '       </div>',
            '   </div>',
            '</div>'
        ];
        var objE = document.createElement("div");
        objE.innerHTML = html.join("")
        document.body.appendChild(objE.childNodes[0])
       var toastId= new bootstrap.Toast(document.getElementById(id), {
            delay: delay || 1000
        }).show()
        var myToastEl = document.getElementById(id)
        myToastEl.addEventListener('hidden.bs.toast', function () {
            myToastEl.outerHTML="";
        })

    },
    confirm: function () {

    },
    prompt: function () {

    }
};