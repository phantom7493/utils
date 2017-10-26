(function () {
    var qh = function () {
        console.log('QueryHelper Created By 独自漫步〃寂静の夜空下');
    };

    /**
     * 基本参数
     */
    var _basicSettings = {
        /**
         * 查询参数
         */
        queryParam: {},

        /**
         * 查询类型
         */
        queryType: {
            exact: {
                alias: '精确查询',
                detail: '精确查询指定内容'
            },
            notExact: {
                alias: '精确排除',
                detail: '精确排除指定内容'
            },
            fuzzy: {
                alias: '模糊查询',
                detail: '可用_(%)替代任一(任意)字符'
            },
            notFuzzy: {
                alias: '模糊排除',
                detail: '可用_(%)替代任一(任意)字符'
            },
            min: {
                alias: '极小值',
                detail: '设定一个极小值(包含)'
            },
            max: {
                alias: '极大值',
                detail: '设定一个极大值(包含)'
            },
            between: {
                alias: '范围查询',
                detail: '使用逗号分隔,两端均包含'
            },
            notBetween: {
                alias: '范围排除',
                detail: '使用逗号分隔,两端均包含'
            }
        },

        /**
         * 错误信息
         */
        errMsg: {
            conditionRepetition: '条件重复'
        }
    };

    /**
     * 客户端参数设置
     */
    var _clientSettings = {
        /**
         * field 参数样例
         * field:{
         *    account: {
         *       //字段别名,且别名需不可重复,可空[即不使用别名]
         *       alias: '账号',
         *       //允许的字段查询类型,可空[即不限制]
         *       queryType: ['min','max','between','notBetween']
         *       //校验数据合法性,可空[即不检查]
         *       validator: {
         *          //为空校验
         *          notEmpty: '账号不能为空'
         *          //正则校验,可传数组
         *          regexp: [{
         *             regexp: /^\d+$/,
         *             message: '账号格式不正确'
         *          }]
         *       }
         *    }
         * }
         */
        field: void 0
    };

    /**
     * 工具方法集
     */
    var _utils = (function () {

        /**
         * 判断是否为数组
         */
        function _isArray(target) {
            return Object.prototype.toString.call(target) === '[object Array]';
        }

        /**
         * 简易遍历
         */
        function _foreach(fn, target) {
            for (var key in target)
                if (target.hasOwnProperty(key))
                    fn(key, target[key]);
        }

        /**
         * 别名映射,若无映射值,则原值返回
         */
        function _aliasMapping(alias, mappings) {
            for (var field in mappings)
                if (mappings.hasOwnProperty(field) && mappings[field]['alias'] === alias)
                    return field;
            return alias;
        }

        /**
         * 获取指定条件的索引值
         */
        function _indexOf(field, queryType, val) {
            var vals = _basicSettings.queryParam[field];
            if (vals === void 0) return -1;
            if ((vals = vals[queryType]) === void 0) return -1;
            for (var i = 0, l = vals.length; i < l; i++)
                if (vals[i] === val) return i;
            return -1;
        }

        /**
         * 校验数据
         */
        function _validate(field, vals) {
            var validator = _clientSettings.field[field].validator;
            if (validator === void 0) return void 0;
            var canEmpty = validator.notEmpty === void 0,
                regexps = validator.regexp;
            if (canEmpty && regexps === void 0) return void 0;
            if (_isArray(vals)) vals = [vals];
            for (var i = 0, l = vals.length; i < l; i++) {
                if (!canEmpty && vals[i] === '') return validator.notEmpty;
                if (regexps === void 0) continue;
                for (var j = 0, lj = regexps.length; j < lj; j++)
                    if (!vals[i].matches(regexps[j].regexp)) return regexps[j].message;
            }
        }

        /**
         * 获取指定字段允许的查询类型,只可用于读取,不能修改
         */
        function _getValidQueryType(field) {
            var validList = _clientSettings.field[field].queryType,
                all = _basicSettings.queryType;
            if (validList === void 0) return all;
            if (!_utils.isArray(validList)) {
                switch (validList) {
                    case 'decimal':
                        validList = ['exact', 'notExact', 'min', 'max', 'between', 'notBetween'];
                        break;
                    case 'string':
                        validList = ['exact', 'notExact', 'fuzzy', 'notFuzzy'];
                        break;
                    case 'time':
                        validList = ['min', 'max', 'between', 'notBetween'];
                        break;
                    default :
                        console.error('unsupported queryType,so replace it with all.');
                        return all;
                }
            }
            var validQueryType = {}, item;
            for (var i = 0, l = validList.length; i < l; i++)
                if (all[item = validList[i]] !== void 0)
                    validQueryType[item] = all[item];
            return validQueryType;
        }

        return {
            isArray: _isArray,
            foreach: _foreach,
            indexOf: _indexOf,
            aliasMapping: {
                field: function (alias) {
                    return _aliasMapping(alias, _clientSettings.field)
                },
                queryType: function (alias) {
                    return _aliasMapping(alias, _basicSettings.queryType)
                }
            },
            validate: _validate,
            getValidQueryType: _getValidQueryType
        }
    })();

    /**
     * 设置客户端参数
     */
    qh.settings = function (settings) {
        _clientSettings = settings;
    };

    /**
     * 返回的查询参数样例
     * [{
     *    field: id,
     *    exact: ['1','3','5','7','9'],
     *    between: [{min: '12',max: '30'}]
     * },{
     *    field: nickname,
     *    fuzzy: ['test0_']
     * }]
     *
     */
    qh.getQueryParams = function () {
        var rst = [], queryParam = _basicSettings.queryParam;
        for (var field in queryParam) {
            if (!queryParam.hasOwnProperty(field)) continue;
            var tmp = {}, conditions;
            tmp.field = field;
            for (var queryType in (conditions = queryParam[field])) {
                if (!conditions.hasOwnProperty(queryType)) continue;
                if (queryType !== 'between' && queryType !== 'notBetween')
                    tmp[queryType] = conditions[queryType];
                else {
                    var range = conditions[queryType].split(',');
                    tmp[queryType] = {
                        min: range[0],
                        max: range[1]
                    }
                }
                rst.push(tmp);
            }
            return rst;
        }
    };

    /**
     * 添加条件,若有错误则返回错误信息,否则返回void 0
     */
    qh.add = function (fieldAlias, queryTypeAlias, val) {
        var field = _utils.aliasMapping.field(fieldAlias),
            queryType = _utils.aliasMapping.queryType(queryTypeAlias);
        if (_utils.indexOf(field, queryType, val) !== -1)
            return _basicSettings.errMsg.conditionRepetition;
        var msg = _utils.validate(field,
            (queryType !== 'between' && queryType !== 'notBetween') ?
                val : val.split(','));
        if (msg !== void 0) return msg;
        var tmp = _basicSettings.queryParam[field];
        if(tmp === void 0)
            tmp = _basicSettings.queryParam[field] = {};
        if (tmp[queryType] === void 0)
            tmp[queryType] = [];
        tmp[queryType].push(val);
    };

    /**
     * 移除条件,若对应参数不填,则全部移除
     */
    qh.remove = function (fieldAlias, queryTypeAlias, val) {
        if(fieldAlias === void 0)
            return void(_basicSettings.queryParam = {});
        var field = _utils.aliasMapping.field(fieldAlias);
        if(queryTypeAlias === void 0)
            return void(_basicSettings.queryParam[field] = void 0);
        var queryType = _utils.aliasMapping.queryType(queryTypeAlias),
            index = _utils.indexOf(field, queryType, val);
        if (index !== -1)
            _basicSettings.queryParam[field][queryType].splice(index, 1);
    };

    /**
     * queryHelper迭代器样例
     * fn = function(key,val){
     *    ...
     * }
     */
    qh.iterator = {
        field: function (fn) {
            _utils.foreach(fn, _clientSettings.field);
        },
        queryParam: function (fn) {
            _utils.foreach(fn, _basicSettings.queryParam);
        },
        /**
         * 遍历指定字段允许的查询类型
         */
        queryType: function (fieldAlias, fn) {
            _utils.foreach(fn, _utils.getValidQueryType(_utils.aliasMapping.field(fieldAlias)));
        }
    };

    window.qh = window.queryHelper = qh;
})();