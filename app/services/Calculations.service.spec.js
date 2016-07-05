/**
 * Created by CMatyas on 05.07.2016.
 * Jasmine test for RegionData service
 */
/*globals describe:true beforeEach:true it:true expect:true inject:true*/

describe('A Calcuations service', function () {
  'use strict'

  var Calculations
  beforeEach(module('biloAtlas'))
  beforeEach(inject(function (_Calculations_) {
    Calculations = _Calculations_
  }))

  // Public API Tests
  describe('Public API', function () {
    it('should provide a average method', function () {
      expect(Calculations.average).toBeDefined()
      expect(typeof Calculations.average).toBe('function')
    })
  })

  //Functional Tests
  describe('average function', function () {
    it('should return the average of a given dataset', function () {
      var data = [2, 2, 2, 2, 2]
      var average = Calculations.average(data)

      expect(average).toBe(2)
    })
    it('should return an integer if unit is not provided or not equal "%"', function () {
      var data = [2.1, 2.1, 2.1, 2.1, 2.1]
      
      var average1 = Calculations.average(data)
      expect(average1).toBe(2)

      var average2 = Calculations.average(data,'some unit')
      expect(average2).toBe(2)
    })
  })
}

