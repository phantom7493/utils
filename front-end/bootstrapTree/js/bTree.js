(function ($) {
    var $bTree;
    var bNodes = [];
    var aStyle = {
        color: {
            end: undefined,
            others: undefined
        },
        style: ''
    };
    var callBack = {
        onClick: function (node) {
        }
    };

    var bTree = function ($divContainer) {
        $bTree = $divContainer;
        $bTree.addClass('bTree');
        return bTree;
    };

    bTree.aColor = function (end, others) {
        aStyle.color.end = end;
        aStyle.color.others = others;
        return bTree;
    };

    bTree.nodesFromJson = function (nodes) {
        bNodes = nodes;
        return bTree;
    };

    bTree.nodesFromAjax = function (url) {
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            success: function (data) {
                bNodes = data;
            },
            error: function () {
                console.error('failed to get nodes');
            }
        });
    };

    bTree.onClick = function () {

    };

    bTree.callBack = function (onEvent, fn) {
        callBack[onEvent] = fn;
        return bTree;
    };

    bTree.end = function () {
        $bTree[0].style.textAlign = 'left';
        var $ul = $('<ul class="nav nav-pills nav-stacked"></ul>');
        $.each(bNodes, function (i, node) {
            _bNode($ul, node, 0);
        });
        $bTree.append($ul[0]);
    };

    function _bNode($container, node, subNum) {
        var $li = _create$liA(node, subNum);
        if (!_isLast(node)) {
            var $ul = $(_simpleCreateTag('ul', {
                id: 'ul_' + node.id,
                class: 'nav nav-pills nav-stacked hide'
            }));
            $ul.attr('id', 'ul_' + node.id);
            $.each(node.nodes, function (i, subnode) {
                _bNode($ul, subnode, subNum + 1);
            });
            $li.append($ul[0]);
        }
        $li.find('> a').on('click', function (e) {
            $bTree.find('a.active').removeClass('active');
            $(e.target).addClass('active');
            if (_isLast(node)) return void(callBack.onClick(node));
            $ul = $li.find('> ul');
            if ($ul.hasClass('hide'))
                $ul.removeClass('hide');
            else
                $ul.addClass('hide');
        });
        $container.append($li[0]);
    }

    function _simpleCreateTag(tag, attrs) {
        var tmp = '<' + tag;
        for (var k in attrs)
            if (attrs.hasOwnProperty(k) && k !== 'innerHtml' && attrs[k] !== undefined)
                tmp += ' ' + k + '="' + attrs[k] + '"';
        tmp += '>';
        if (attrs['innerHtml'] !== undefined) tmp += attrs['innerHtml'];
        tmp += '</' + tag + '>';
        return tmp;
    }

    function _isLast(node) {
        return node.nodes === undefined;
    }

    function _create$liA(node, subNum) {
        var a = _simpleCreateTag('a', {
            class: (node['icon'] === undefined) ? undefined : 'glyphicon glyphicon-' + node['icon'],
            href: 'javascript: void(0)',
            style: 'margin-left:' + (8 + 16 * subNum) + 'px;color:' +
            (_isLast(node) ? aStyle.color.end : aStyle.color.others) +
            aStyle.style,
            innerHtml: ' ' + node['text']
        });
        var li = _simpleCreateTag('li', {
            id: (node['id'] === undefined || _isLast(node)) ? undefined : 'li_' + node['id'],
            innerHtml: a
        });
        return $(li);
    }

    window.bTree = bTree;
})(jQuery);