if (true || document.getElementsByClassName('place-your-order-button')) {
    var layerNode = document.createElement('div');
    layerNode.setAttribute('id', 'dialog');
    layerNode.setAttribute('title', 'Basic Dialog');
    var pNode = document.createElement('p');
    console.log('pnode created');

    pNode.innerHTML = '<h1>important shits going on</h1>';

    layerNode.appendChild(pNode);
    //document.body.appendChild(layerNode);
    document.body.insertBefore(layerNode, document.getElementById('a-page'));

    jQuery('#dialog').dialog({
        autoOpen: true,
        height: 'auto',
        width: 500,
        zIndex: 99999,
        background: 'red',
        open: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
            $(event.target).parent().css('top', '5px');
            $(event.target).parent().css('left', '10px');
        }
    });
    $('#dialog').css('z-index', 9999);
    $('#dialog').parent().css('z-index', 9999);
    $('#dialog').css('background', 'white');
    $('.modal-backdrop').css('z-index', '-1');
    document.getElementById('dialog').style.zIndex = 9999;
}
