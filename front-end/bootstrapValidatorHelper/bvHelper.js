(function () {

    var bvh = function () {
        console.log('bootstarpValidatorHelper Created By 独自漫步〃寂静の夜空下');
    };

    /**
     * bootstrapValidator使用样例
     * bvh.bootstrapValidator.
     *    currField('repassword','确认密码不能为空').identical('password','两次密码不一致').
     *    currField('email').emailAddress('邮箱格式不正确').
     *    end();
     */
    bvh.bootstrapValidator = (function () {

        var bv = function () {
            bvh();
        };

        /**
         * _field 样例
         * {
         *    curr: 'repassword',
         *    list: {
         *       account: {validators: {...}}
         *    }
         * }
         */
        var _field = {
            curr: void 0,
            list: {}
        };

        /**
         * 设置当前字段,若emtryMessage为void 0,则字段可空
         */
        bv.currField = function (field, emptyMessage) {
            _field.curr = field;
            if (_field.list[field] === void 0)
                _field.list[field] = {validators: {}};
            if (emptyMessage !== void 0)
                _field.list[field].validators.notEmpty = {
                    message: emptyMessage
                };
            return bv;
        };

        /**
         * 真正执行bootstrapValidator处,最后调用***input外必须有一个class为form-group的元素
         * @param $form 目标表单
         */
        bv.end = function ($form) {
            $form.bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: _field.list
            });
            _field = {
                curr: void 0,
                list: {}
            };
        };

        bv.stringLength = function (min, max, message) {
            _field.list[_field.curr].validators.stringLength = {
                min: min,
                max: max,
                message: message
            };
            return bv;
        };

        bv.regexp = function (regexp, message) {
            _field.list[_field.curr].validators.regexp = {
                regexp: regexp,
                message: message
            };
            return bv;
        };

        bv.identical = function (field, message) {
            _field.list[_field.curr].validators.identical = {
                field: field,
                message: message
            };
            return bv;
        };

        bv.emailAddress = function (message) {
            _field.list[_field.curr].validators.emailAddress = {
                message: message
            };
            return bv;
        };

        return bv;
    })();

    /**
     * 便捷操作$form.on('success.form.bv')
     */
    bvh.easyForm = (function () {

        var easyForm = function () {
            bvh();
        };

        //表单提交时的事件 可为'before/after/success/error'
        var _whenSubmit = {};

        /**
         * @param status 可为 'before/after/success/error'
         * @param fn 事件方法
         */
        easyForm.whenSubmit = function (status, fn) {
            _whenSubmit[status] = fn;
            return easyForm;
        };

        easyForm.end = function ($form) {
            $form.on('success.form.bv', function (e) {
                e.preventDefault();
                if (_whenSubmit.before !== void 0) _whenSubmit.before();
                $.ajax({
                    type: 'post',
                    url: $form.attr('action'),
                    data: $(e.target).serialize(),
                    cache: false,
                    success: function (data) {
                        if (_whenSubmit.success !== void 0)
                            _whenSubmit.success(data);
                    },
                    error: function (data) {
                        if (_whenSubmit.error !== void 0)
                            _whenSubmit.error(data);
                    }
                });
                if (_whenSubmit.after !== void 0) _whenSubmit.submit.after();
            });
        };

        return easyForm;
    })();

    window.bvh = window.bvHelper = window.bootstrapValidatorHelper = bvh;
})();