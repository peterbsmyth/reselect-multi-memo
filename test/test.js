import expect from 'expect'
import assert from 'assert'
import {customMemoize} from '../index'
import { createSelectorCreator } from 'reselect'
import sinon from 'sinon'


describe('Testing Memoize', function() {

  it('takes arguments and returns a value', function() {
    const state = {
      first: 1,
      second: 1
    }

    const firstSelector = state => state.first
    const secondSelector = state => state.second
    const customSelectorCreator = createSelectorCreator(customMemoize)
    const customSelector = customSelectorCreator(
      firstSelector,
      secondSelector,
      (first, second) => {
        return first + second
      }
    )

    assert.equal(customSelector(state), 2)
  })

  it('takes state and caches results', function() {

    const state = {
      first: 1,
      second: 1
    }

    let addFn = sinon.spy((first, second) => {
      return first + second
    })

    const firstSelector = state => state.first
    const secondSelector = state => state.second
    const customSelectorCreator = createSelectorCreator(customMemoize)
    const customSelector = customSelectorCreator(
      firstSelector,
      secondSelector,
      addFn
    )
    let initialOut = customSelector(state)
    let secondOut = customSelector(state)

    assert.equal(initialOut, secondOut)
    assert(addFn.calledOnce)
  })

  it('takes two different states and caches results for both', function() {

    const state = {
      first: 1,
      second: 1
    }

    const nextState = {
      first: 2,
      second: 1
    }
    let addFn = sinon.spy((first, second) => {
      return first + second
    })

    const firstSelector = state => state.first
    const secondSelector = state => state.second
    const customSelectorCreator = createSelectorCreator(customMemoize)
    const customSelector = customSelectorCreator(
      firstSelector,
      secondSelector,
      addFn
    )
    let initialOut = customSelector(state)
    let secondOut = customSelector(nextState)
    assert(addFn.calledTwice)
    let thirdOut = customSelector(state)
    let fourthOut = customSelector(nextState)

    assert(addFn.calledTwice)
  })

  it('implements a custom cache size', function() {

    let addFn = sinon.spy((first, second) => {
      return first + second
    })

    const firstSelector = state => state.first
    const secondSelector = state => state.second
    const customSelectorCreator = createSelectorCreator(customMemoize, undefined, 2)
    const customSelector = customSelectorCreator(
      firstSelector,
      secondSelector,
      addFn
    )

    const state = {
      first: 1,
      second: 1
    }

    const nextState = {
      first: 2,
      second: 1
    }

    const thirdState = {
      first: 1,
      second: 2
    }

    customSelector(state)
    customSelector(nextState)
    customSelector(thirdState)
    customSelector(state)
    assert.equal(addFn.callCount, 4)


  })

})
