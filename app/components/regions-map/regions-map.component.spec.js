/**
 * Spec for the map view conponent
 * author: Christian Matyas
 */

describe('A map view component', function(){
    if('can visualize the map of upper franconia', function(){})
    describe('can bind data', function(){
        it('if the data is empty a map of upper franconia is shown', function(){})
        it('if the data contains a value of 100 for Bamberg, the map shows that region in a color depending on the provided color schema', function(){})
        it('if the data contains a value of 100 for Bamberg, the map shows 100 as tooltip on a mouse over', function(){})
    })
    describe('can use a colorschema like ["#cef2b6", "#94d66c", "#5aba22"]', function(){
        it('regions with zero value are shown in white', function(){})
        it('regions with a missing value are shown in grey', function(){})
        it('regions with a maxmimum value get the color "#5aba22"', function(){})
    })
})
