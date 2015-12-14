describe('Directive: topic-table', function () {
    var $compile, $rootScope;

    beforeEach(module('biloAtlas'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        // we need the root scope and the compile service
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should show a topic', function () {
        var template = '<topic-table id="1"></topic-table>';
        var scope = $rootScope.$new(); // create a new scope
        var element = $compile(template)(scope); // compile the template against the scope
        scope.$apply(); // trigger dirty checking

        // now the directive is ready to check if expectations are satisfied
    });
});
