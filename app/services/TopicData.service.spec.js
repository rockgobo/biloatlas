/**
 * Created by CMatyas on 03.12.2015.
 * Jasmine test for TopicData service. More on Jamsine: http://jasmine.github.io/
 */
/*globals describe:true beforeEach:true it:true expect:true inject:true*/

describe('A TopicData service', function () {
  'use strict'

  var TopicData
  beforeEach(module('biloAtlas'))
  beforeEach(inject(function (_TopicData_) {
    TopicData = _TopicData_
  }))

  // Public API Tests
  describe('Public API', function () {
    it('should provide a getTopics Api method', function () {
      expect(TopicData.getTopics).toBeDefined()
      expect(typeof TopicData.getTopics).toBe('function')
    })
    // Get Tests
    it('should provide a getopicById Api method', function () {
      expect(TopicData.getTopicById).toBeDefined()
      expect(typeof TopicData.getTopicById).toBe('function')
    })
  })

  describe('getTopics method', function () {
    it('should provide a getTopics Api method that return a list of topics', function () {
      TopicData.getTopics().then(function (topics) {
        console.log(topics)

        expect(topics.length).toBeGreaterThan(0)
        expect(topics instanceof Array).toBe(true)
        expect(Array.isArray(topics)).toBe(true)
      })
    })
  })

  describe('getTopicById method', function () {
    it('should return the topic with a given id', function () {
      // Extract a topic as test case
      TopicData.getTopics().then(function (topics) {
        expect(topics.length).toBeGreaterThan(0)
        // Test if the object return by id is equal to the extracted topic from the list
        var topicToGet = topics[0]
        TopicData.getTopicById(topicToGet.id).then(function (topic) {
          expect(topic instanceof Object).toBe(true)
          expect(topic.id).toBe(topicToGet.id)
          expect(topic).toEqual(topicToGet)
        })
      })
    })

    it('should return null for a unknown id', function () {
      TopicData.getTopicById(9999999999).then(function (topic) {
        expect(topic).toBeNull()
      })
    })
  })
})
