(function ($) {

    var bTree = function(){
        console.log('bootstrapTree Created By 独自漫步〃寂静の夜空下');
    };

    /**
     * 基本设置
     */
    var _basicSettings = {
        defaultValue: [{
            keyChain: 'nodeSettings.style.color',
            value: {last: 'black', others: 'gray'}
        }, {
            keyChain: 'nodeSettings.style.offset',
            value: {first: 8, others: 16}
        },{
            keyChain: 'nodeSettings.style.optional',
            value: 'padding: 2px;margin: 1px;'
        }]
    };

    /**
     * 客户参数样例
     * {
     *    $bTree: $('#div_bTree'), //bootstrapTree的jQuery对象,不可为空
     *    nodeSettings: { //bootstrapTree节点设置
     *       style: { //节点样式
     *          color: { //节点颜色
     *             last: 'black', //叶子节点颜色
     *             others: 'gray' //其余节点颜色
     *          },
     *          offset: { //节点偏移
     *             first: 8, //顶层节点的偏移量
     *             others: 16 //子节点的偏移量
     *          }
     *          optional: void 0
     *       }
     *       callBack: {
     *          onClick: function($a,node){...}
     *       }
     *    },
     *    nodes: [{
     *       id: 1,
     *       text: '用户管理',
     *       icon: 'user', //使用bootstrap自带icon,即自动加上前缀'glyphicon glyphicon-'
     *       data: {...}, //节点的附带数据
     *       subnodes: [{
     *          id: 2,
     *          text: '用户列表',
     *          icon: 'list'
     *       }]
     *    }]
     * }
     */
    var _clientSettings = {};

    /**
     * bootstrapTree工具集
     * @private
     */
    var _utils = (function () {

        /**
         * 判断目标是否为数组
         */
        function isArray(target) {
            return Object.prototype.toString.call(target) === '[object Array]';
        }

        /**
         * 通过字符串键链获取json中的某值,一旦链中有void 0,则返回void 0
         */
        function json_getValByKeyChain(json, keyChain) {
            if (json === void 0) return void 0;
            var keys = keyChain.split('.');
            for (var i = 0, l = keys.length; i < l; i++)
                if ((json = json[keys[i]]) === void 0) break;
            return json;
        }

        /**
         * 通过字符串键链设置json中的某值,若链中有void 0,则创建空{}
         */
        function json_setValByKeyChain(json, keyChain, value) {
            if (json === void 0) json = {};
            var sub = json, key, keys = keyChain.split('.'), n = keys.length - 1;
            for (var i = 0; i <= n; i++) {
                if (sub[key = keys[i]] === void 0)
                    if (i !== n) sub[key] = {};
                    else sub[key] = value;
                sub = sub[key];
            }
            return json;
        }

        /**
         * 判断是否为叶子结点
         */
        function node_isEnd(node) {
            return node['subnodes'] === void 0;
        }

        /**
         * 生成节点(即a标签)html代码
         */
        function node_add_gnrtTagA(node,subNum){
            var tmp,$a = $('<a href="javascript:void(0)" style="padding: 2px auto 4px 4px"></a>');
            if(node['icon'] === void 0)
                $a.text(node['text']);
            else{
                $a.addClass('glyphicon glyphicon-' + node['icon']);
                //若有bootstrap图标则需要加空格
                $a.text(' ' + node['text']);
            }
            tmp = json_getValByKeyChain(_clientSettings, 'nodeSettings.style.optional');
            if (tmp !== void 0) {
                if(tmp.indexOf('padding') === -1)
                    tmp = _utils.json.getByKeyChain(_clientSettings,'nodeSettings.style.optional') + tmp;
                $a[0].style = tmp;
            }
            //设置子节点左偏移
            tmp = json_getValByKeyChain(_clientSettings, 'nodeSettings.style.offset');
            $a[0].style.marginLeft = (tmp['first'] + subNum * tmp['others']) + 'px';
            //若为叶子结点则设置颜色为color['end']
            tmp = json_getValByKeyChain(_clientSettings, 'nodeSettings.style.color');
            $a[0].style.color = node_isEnd(node) ? tmp['end'] : tmp['others'];
            //注册节点单击事件
            $a.on('click', (function ($a, node) {
                return function () {
                    var fn = json_getValByKeyChain(_clientSettings,'nodeSettings.callBack.onClick');
                    if (node_isEnd(node))
                        return fn !== void 0 ? fn($a, node) : void 0;
                    var $ul = $a.next('ul');
                    if ($ul.hasClass('hide')) $ul.removeClass('hide');
                    else $ul.addClass('hide');
                }
            })($a, node));
            return $a;
        }

        /**
         * 生成bootstrapTree的html代码
         */
        function node_add($container, nodes, subNum) {
            for(var i = 0,l = nodes.length;i < l;i++){
                var $li = $('<li></li>'),
                    node = nodes[i];
                $li.append(node_add_gnrtTagA(node,subNum));
                if(!node_isEnd(node)){
                    var $ul = $('<ul class="nav nav-pills nav-stacked hide"></ul>');
                    node_add($ul,node['subnodes'],subNum + 1);
                    $li.append($ul);
                }
                $container.append($li);
            }
        }

        return {
            isArray: isArray,
            node: {
                add: node_add
            },
            json: {
                getByKeyChain: json_getValByKeyChain,
                setByKeyChain: json_setValByKeyChain
            }
        };
    })();

    /**
     * 设置bTree参数,一个bTree一般只需调用一次
     */
    bTree.settings = function (settings) {
        settings.$bTree.addClass('bTree');
        var dv, dvs = _basicSettings.defaultValue;
        for (var i = 0, l = dvs.length; i < l; i++)
            if (_utils.json.getByKeyChain(settings, (dv = dvs[i]).keyChain) === void 0)
                _utils.json.setByKeyChain(settings, dv.keyChain, dv.value);
        _clientSettings = settings;
        return bTree;
    };

    /**
     * 生成Html代码
     */
    bTree.generate = function () {
        var _$container = _clientSettings['$bTree'];
        _$container.addClass('bTree');
        _$container[0].style.padding = '0px 2px 4px 2px';
        _clientSettings['$bTree'] = _$container;
        _$container[0].style.textAlign = 'left';
        var _$topUl = $('<ul class="nav nav-pills nav-stacked"></ul>');
        _utils.node.add(_$topUl, _clientSettings['nodes'], 0);
        _$container.append(_$topUl);
    };

    window.bTree = bTree;
})(jQuery);