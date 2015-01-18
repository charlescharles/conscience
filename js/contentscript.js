String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

// var products = function () {
//     return $('.asin-title').toArray().map(function(p) {return p.innerText;});
// }

// var price = function () {
//     var p = $('.grand-total-price').text().slice(1).replace(',', '');
//     return parseFloat(p);
// }

// var html = function () {
//     return myhtml.format(price(), products());
// }

var getPrice = function () { return 50.00; };

var getProducts = function () { return ['some shit', 'more shit', 'shit you dont need']; };

var renderPopup = function (html, amount, prods) {
    var price = '$' + amount.toString();
    var products = prods.join(', ');
    return html.format(price, price, products);
};

var renderListItem = function (html, donationOption, amt) {
    var count = roundDiv(amt, donationOption.unitCost);
    var text = donationOption.text.format(count);
    var imgUrl = chrome.extension.getURL(donationOption.imgSrc);
    return html.format(imgUrl, capitalize(text), donationOption.link);
};

var roundDiv = function (num, denom) {
    return Math.round(10.0 * num / denom) / 10;
};

var capitalize = function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

var donationOptions = [
    {
        id: 'cleftLip',
        unitCost: 240.0,
        text: "fix <b>{0}</b> children's cleft lips",
        imgSrc: 'img/cleft.jpg',
        link: 'www.google.com'
    },
    {
        id: 'cataract',
        unitCost: 35.0,
        text: "help <b>{0}</b> people see",
        imgSrc: 'img/cataract.jpg',
        link: 'www.google.com'
    },
    {
        id: 'parasite',
        unitCost: 0.3,
        text: "rid <b>{0}</b> children of intestinal parasites",
        imgSrc: 'img/parasite.jpg',
        link: 'www.google.com'
    },
    {
        id: 'net',
        unitCost: 5.3,
        text: "provide <b>{0}</b> households with malaria bednets",
        imgSrc: 'img/bednet.jpg',
        link: 'www.google.com'
    },
    {
        id: 'school',
        unitCost: 175.0,
        text: "help <b>{0}</b> Kenyan children afford a year of secondary school",
        imgSrc: 'img/school.jpg',
        link: 'www.google.com'
    },
    {
        id: 'roof',
        unitCost: 11.68,
        text: "replace <b>{0}</b> Kenyan families' thatched roofs",
        imgSrc: 'img/roof.jpg',
        link: 'www.google.com'
    },
    {
        id: 'food',
        unitCost: 175.0,
        text: "give someone <b>{0}</b> years' worth of food",
        imgSrc: 'img/food.jpg',
        link: 'www.google.com'
    }
];

var loaded = false;

var feelsbad = function () {
    if (loaded) return;
    if (true || document.getElementsByClassName('place-your-order-button').length) {
        loaded = true;
        var layerNode = document.createElement('div');
        layerNode.setAttribute('id', 'modal');
        layerNode.setAttribute('class', 'modal');

        var popupUrl = chrome.extension.getURL('popup.html');
        var listItemUrl = chrome.extension.getURL('listItem.html');

        var amount = getPrice();
        var products = getProducts();

        $.get(popupUrl, function (popupHtml) {
            $('#modal').html(renderPopup(popupHtml, amount, products));

            $.get(listItemUrl, function (listItemHtml) {
                var opts = donationOptions.sort(function (a, b) {
                    return a.unitCost - b.unitCost;
                });
                opts.map(function (opt) {
                    var li = renderListItem(listItemHtml, opt, amount);
                    $('.alternatives-list').append(li);
                });
            });
        });

        document.body.insertBefore(layerNode, document.getElementById('a-page'));

        $('#modal').modal('show');
    }
};

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    console.log(mutations, observer);
    feelsbad();
});

observer.observe(document, {
  subtree: true,
  attributes: true
});
