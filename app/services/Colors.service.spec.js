describe('A Color service',function(){
    'use strict'

    var Colors
    beforeEach(module('biloAtlas'))
    beforeEach(inject(function (_Colors_) {
        Colors = _Colors_
    }))

    describe('has a public createColors method',function(){
        it('exists and is a function', function(){
            expect(Colors.createColors ).toBeDefined()
            expect(typeof Colors.createColors).toBe('function')
        })
        it('creates a list of 10 colors, if 10 is passed as count value', function(){
            var colors = Colors.createColors('#FFF', '#FFF', 10);
            except(colors.length).toBe(10)
        })
        it('throws an error if the same color is provided for start and end', function(){
            expect( function(){ Colors.createColors('#FFF','#FFF',20); } ).toThrow();
        })
        it('throws an error if the result contains duplicates (usually when the count is very high)', function(){
            expect( function(){ Colors.createColors('#FFF','#FF1',2000); } ).toThrow();
        })
    })
})