(function () {
    if (window.bootstrapValidatorHelper !== undefined) return;
    window.bvHelper = window.bootstrapValidatorHelper = (function () {
        var bvh = function () {
        };

        bvh.bootstrapValidator = (function () {
            var bv = function () {
            };
            var currField,
                bvParam = {
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {}
                };
            bv.setCurrField = function (field, emptyMessage) {
                if (bvParam.fields[field] === undefined)
                    bvParam.fields[field] = {validators: {}};
                currField = field;
                if (emptyMessage !== undefined)
                    bvParam.fields[currField].validators.notEmpty = {
                        message: emptyMessage
                    };
                return bv;
            };

            bv.end = function ($form) {
                console.log(bvParam);
                $form.bootstrapValidator(bvParam);
                bvParam.fields = {};
            };

            bv.stringLength = function (min, max, message) {
                bvParam.fields[currField].validators.stringLength = {
                    min: min,
                    max: max,
                    message: message
                };
                return bv;
            };

            bv.regexp = function (regexp, message) {
                bvParam.fields[currField].validators.regexp = {
                    regexp: regexp,
                    message: message
                };
                return bv;
            };

            bv.identical = function (field, message) {
                bvParam.fields[currField].validators.identical = {
                    field: field,
                    message: message
                };
                return bv;
            };

            bv.emailAddress = function (message) {
                bvParam.fields[currField].validators.emailAddress = {
                    message: message
                };
                return bv;
            };

            return bv;
        })();

        bvh.onSubmit = (function () {
            var onSubmit = function () {
            };
            var before = {}, after = {}, ajaxParam = {};

            onSubmit.beforeValidate = function (fn) {
                before.validate = fn;
                return onSubmit;
            };
            onSubmit.afterValidate = function (fn) {
                after.validate = fn;
                return onSubmit;
            };

            onSubmit.beforeSubmit = function (fn) {
                before.submit = fn;
                return onSubmit;
            };
            onSubmit.afterSubmit = function (fn) {
                after.submit = fn;
                return onSubmit;
            };

            onSubmit.setAjaxParam = function (url, successFn, errorFn) {
                ajaxParam.url = url;
                ajaxParam.success = successFn;
                ajaxParam.error = errorFn;
                return onSubmit;
            };

            onSubmit.end = function ($form) {
                $form.on('success.form.bv', function (e) {
                    e.preventDefault();
                    if (before.validate !== undefined) before.validate();
                    if (!$(e.target).data('bootstrapValidator').isValid())
                        return false;
                    if (after.validate !== undefined) after.validate();
                    if (before.submit !== undefined) before.submit();
                    $.ajax({
                        type: 'post',
                        url: ajaxParam.url,
                        data: $(e.target).serialize(),
                        cache: false,
                        success: function (data) {
                            if (ajaxParam.success !== undefined)
                                ajaxParam.success(data);
                        },
                        error: function (data) {
                            if (ajaxParam.error !== undefined)
                                ajaxParam.error(data);
                        }
                    });
                });
            };

            return onSubmit;
        })();

        return bvh;
    })();
})();