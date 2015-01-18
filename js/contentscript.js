var myhtml = "\
<div class='modal-dialog modal-lg'> \
    <div class='modal-content'> \
        <div class='modal-header'> \
            <h4 class='modal-title'>Large Modal</h4> \
        </div> \
        <div class='modal-body'> \
            <p>this is a big fucking modal</p> \
            <p>you spent {0} on {1}</p> \
        </div> \
        <div class='modal-footer'> \
            <button type='button' class='btn btn-default' data-dismiss='modal'>Cancel</button> \
                <button type='button' class='btn btn-primary'>OK</button> \
        </div> \
    </div> \
</div>";

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
};


var products = function () {
    var names = $('.asin-title').toArray().map(function(p) {return p.innerText;});
    return names.join(', ');
}

var price = function () {
    var p = $('.grand-total-price').text().slice(1).replace(',', '');
    return parseFloat(p);
}

var html = function () {
    return myhtml.format(price(), products());
}

if (true || document.getElementsByClassName('place-your-order-button')) {
    var layerNode = document.createElement('div');
    layerNode.setAttribute('id', 'conscience-modal');
    layerNode.setAttribute('class', 'modal');

    layerNode.innerHTML = html();

    document.body.insertBefore(layerNode, document.getElementById('a-page'));

    $('#conscience-modal').modal('show');
}
