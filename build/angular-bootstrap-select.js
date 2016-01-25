// supply open and close without load bootstrap.js
angular.module('angular-bootstrap-select.extra', [])
    .directive('toggle', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // prevent directive from attaching itself to everything that defines a toggle attribute
                if (!element.hasClass('selectpicker')) {
                    return;
                }

                var target = element.parent();
                var toggleFn = function () {
                    target.toggleClass('open');
                };
                var hideFn = function () {
                    target.removeClass('open');
                };

                element.on('click', toggleFn);
                element.next().on('click', hideFn);

                scope.$on('$destroy', function () {
                    element.off('click', toggleFn);
                    element.next().off('click', hideFn);
                });
            }
        };
    });

angular.module('angular-bootstrap-select', [])
    .directive('selectpicker', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            require: '?ngModel',
            priority: 10,
            compile: function (tElement, tAttrs, transclude) {
                tElement.selectpicker($parse(tAttrs.selectpicker)());
                tElement.selectpicker('refresh');
                return function (scope, element, attrs, ngModel) {
                    if (!ngModel) return;

                    scope.$watch(attrs.ngModel, function (newVal, oldVal) {
                        scope.$evalAsync(function () {
                            if (attrs.ngOptions && /track by/.test(attrs.ngOptions)) {

                                var result = attrs.ngOptions.split(/track by/);
                                if (result.length > 1 && angular.isDefined(newVal)) {
                                    result = result[1].trim().split(/\./).splice(1, Number.MAX_VALUE);
                                    var value = newVal;
                                    for (var index = 0; index < result.length; index++) {
                                        if( value != undefined)
                                            value = value[result[index]];
                                    }
                                    element.val(value);
                                }
                            }else{
                                element.val(newVal);
                            }
                            element.selectpicker('refresh');
                        });
                    });


                    ngModel.$render = function () {
                        scope.$evalAsync(function () {
                            element.selectpicker('refresh');
                        });
                    }
                };
            }

        };
    }]);
