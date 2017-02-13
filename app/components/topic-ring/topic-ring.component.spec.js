/**
 * Spec for the region pie conponent
 * author: Christian Matyas
 */

describe('A topic ring component', function(){
    it('can visualize data like [{name: "Bamberg", value:"2"}, {name: "Erlangen", value:"5"}] as a pie diagram',function(){ })
    it('is not visible if the data contains negative values',function(){ })
    it('reacts on a changing color schema',function(){ })
    describe('has a method checkData to make validation check on the data',function(){ 
        it('returns false if data contains negative values', function(){})
    })
    describe('shows the values of the regions',function(){ 
        it('visualize the value under the region name', function(){})
        it('don´t visualize the value under the region name if the arc angle is below 0.2', function(){})
        it('don´t visualize anything if the value is zero', function(){})
    })
})