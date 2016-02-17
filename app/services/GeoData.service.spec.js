/**
 * Created by CMatyas on 03.02.2016.
 * Jasmine test for RegionData service
 */

describe('A GeoData service', function(){
    "use strict"

    var GeoData;
    beforeEach(module('biloAtlas'));
    beforeEach(inject(function (_GeoData_) {
        GeoData = _GeoData_;
    }))
    
    //Public API Tests
    describe('Public API', function () {
        it('should provide a geoCollection Api method', function () { 
            expect(GeoData.geoCollection).toBeDefined();
            expect(typeof GeoData.geoCollection).toBe('function'); 
        });
        //Get Tests
        it('should provide a getRegionData Api method', function () {
            expect(GeoData.getRegionData).toBeDefined();
            expect(typeof GeoData.getRegionData).toBe('function');
        }) 
    })

    describe('geoCollection method', function () {
        it('should provide a geoCollection Api method that return a list of regions', function () {
            var collection = GeoData.geoCollection
            expect(collection.length).toBeGreaterThan(0);
            expect(collection instanceof Array).toBe(true);
        })
    })
    
    
    describe('getRegionData method', function () {
        it('should return the geocollection feature for a given id', function () {
            //Extract a topic as test case
            var region = GeoData.geoCollection()[0]
            var region_ = GeoData.getRegionById(region.properties.ID_3);
            expect(region_ instanceof Object).toBe(true);
            expect(region_.properties.ID_3).toBe(region.properties.ID_3);
            expect(region_).toEqual(region);
             
        })

        it('should return null for a unknown id', function () {
            var region = GeoData.getRegionData(9999999999);
            expect(region).toBeNull();
        })
    })
})