String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

var getProducts = function () {
    return $('.asin-title').toArray().map(function(p) {return p.innerText;});
}

var getPrice = function () {
    var p = $('.grand-total-price').text().slice(1).replace(',', '');
    return parseFloat(p);
}

// var getPrice = function () { return 50.00; };

// var getProducts = function () {
//     return ["shit', 'useless shit', 'more shit you don't need"];
// };

var renderPopup = function (html, amount, prods) {
    var price = numeral(amount).format('$0,0[.]00');
    var products = prods.join(', ');
    return html.format(price, price, products);
};

var renderListItem = function (html, donationOption, amt) {
    var count = numeral(amt / donationOption.unitCost).format('0,0');
    var text = donationOption.text.format(count);
    var imgUrl = chrome.extension.getURL(donationOption.imgSrc);
    return html.format(imgUrl, capitalize(text), donationOption.link);
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
        link: 'https://givewell.secure.nonprofitsoapbox.com/donate-to-givewell'
    },
    {
        id: 'cataract',
        unitCost: 35.0,
        text: "help <b>{0}</b> people see",
        imgSrc: 'img/cataract.jpg',
        link: 'https://givewell.secure.nonprofitsoapbox.com/donate-to-givewell'
    },
    {
        id: 'parasite',
        unitCost: 0.3,
        text: "rid <b>{0}</b> children of intestinal parasites",
        imgSrc: 'img/parasite.jpg',
        link: 'https://givewell.secure.nonprofitsoapbox.com/donate-to-givewell'
    },
    {
        id: 'net',
        unitCost: 5.3,
        text: "provide <b>{0}</b> households with malaria bednets",
        imgSrc: 'img/bednet.jpg',
        link: 'https://givewell.secure.nonprofitsoapbox.com/donate-to-givewell'
    },
    {
        id: 'school',
        unitCost: 175.0,
        text: "help <b>{0}</b> Kenyan children afford a year of secondary school",
        imgSrc: 'img/school.jpg',
        link: 'https://givewell.secure.nonprofitsoapbox.com/donate-to-givewell'
    },
    {
        id: 'roof',
        unitCost: 11.68,
        text: "replace <b>{0}</b> Kenyan families' thatched roofs",
        imgSrc: 'img/roof.jpg',
        link: 'https://givewell.secure.nonprofitsoapbox.com/donate-to-givewell'
    },
    {
        id: 'food',
        unitCost: 175.0,
        text: "give someone <b>{0}</b> years' worth of food",
        imgSrc: 'img/food.jpg',
        link: 'https://givewell.secure.nonprofitsoapbox.com/donate-to-givewell'
    }
];

var loaded = false;

var affordable = function (option, amt) {
    return amt > option.unitCost;
}

var feelsbad = function () {
    if (loaded) return;
    if (document.getElementsByClassName('place-your-order-button').length) {
        loaded = true;
        var layerNode = document.createElement('div');
        layerNode.setAttribute('id', 'modal');
        layerNode.setAttribute('class', 'modal');

        var popupUrl = chrome.extension.getURL('html/popup.html');
        var listItemUrl = chrome.extension.getURL('html/listItem.html');

        var amount = getPrice();
        var products = getProducts();

        $.get(popupUrl, function (popupHtml) {
            $('#modal').html(renderPopup(popupHtml, amount, products));

            $.get(listItemUrl, function (listItemHtml) {
                var opts = donationOptions.sort(function (a, b) {
                    return a.unitCost - b.unitCost;
                });
                opts.map(function (opt) {
                    if (affordable(opt, amount)) {
                        var li = renderListItem(listItemHtml, opt, amount);
                        $('.alternatives-list').append(li);
                    }
                });
            });
        });

        document.body.insertBefore(layerNode, document.getElementById('a-page'));

        $('#modal').modal('show');
    }
};

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    feelsbad();
});

observer.observe(document, {
  subtree: true,
  attributes: true
});
