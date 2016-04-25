/**
 * Created by CMatyas on 03.02.2016.
 * Jasmine test for RegionData service
 */
/*globals describe:true beforeEach:true it:true expect:true inject:true*/

describe('A RegionData service', function () {
  'use strict'

  var RegionData
  beforeEach(module('biloAtlas'))
  beforeEach(inject(function (_RegionData_) {
    RegionData = _RegionData_
  }))

  // Public API Tests
  describe('Public API', function () {
    it('should provide a getRegions Api method', function () {
      expect(RegionData.getRegions).toBeDefined()
      expect(typeof RegionData.getRegions).toBe('function')
    })
    // Get Tests
    it('should provide a getRegionById Api method', function () {
      expect(RegionData.getRegionById).toBeDefined()
      expect(typeof RegionData.getRegionById).toBe('function')
    })
  })

  describe('getRegions method', function () {
    it('should provide a getRegions Api method that return a list of regions', function () {
      RegionData.getRegions().then(function (regions) {
        expect(regions.length).toBeGreaterThan(0)
        expect(regions instanceof Array).toBe(true)
      })
    })
  })

  describe('getRegionById method', function () {
    it('should return the topic with a given id', function () {
      // Extract a topic as test case
      RegionData.getRegions().then(function (regions) {
        expect(regions.length).toBeGreaterThan(0)
        // Test if the object return by id is equal to the extracted topic from the list
        var regionToGet = regions[0]
        RegionData.getRegionById(regionToGet.id).then(function (region) {
          expect(region instanceof Object).toBe(true)
          expect(region.id).toBe(regionToGet.id)
          expect(region).toEqual(regionToGet)
        })
      })
    })

    it('should return null for a unknown id', function () {
      RegionData.getTopicById(9999999999).then(function (region) {
        expect(region).toBeNull()
      })
    })
  })
})
