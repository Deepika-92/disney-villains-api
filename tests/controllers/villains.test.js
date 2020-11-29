/* eslint-disable max-len */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const {
  before, afterEach, beforeEach, describe, it
} = require('mocha')
const { villainsList, singleVillain } = require('../mocks/villains')
const { getAllVillains, getVillainBySlug, createNewVillain } = require('../../controllers/villains')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - villains', () => {
  let sandbox
  let stubbedFindAll
  let stubbedFindOne
  let stubbedCreate
  let stubbedSend
  let response
  let stubbedSendStatus
  let stubbedStatusSend
  let stubbedStatus

  before(() => {
    sandbox = sinon.createSandbox()

    stubbedFindOne = sandbox.stub(models.villains, 'findOne')
    stubbedFindAll = sinon.stub(models.villains, 'findAll')
    stubbedCreate = sinon.stub(models.villains, 'create')

    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatusSend = sandbox.stub()
    stubbedStatus = sandbox.stub()

    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus,
    }
  })
  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusSend })
  })

  afterEach(() => {
    sandbox.reset()
  })



  describe('getAllVillains', () => {
    it('retrieves list of villains from database and calls response.send() with list', async () => {
      stubbedFindAll.returns(villainsList)
      const stubbedSend = sinon.stub()
      const response = { send: stubbedSend }

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(villainsList)
    })
    it('returns a 500 when no villains is found', async () => {
      stubbedFindAll.throws('ERROR!')

      await getAllVillains({}, response)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Sorry villains could not found')
    })
  })

  describe('getVillainBySlug', () => {
    it('retrieves villain associated with provided slug from database and calls response.send with it', async () => {
      const request = { params: { slug: 'gaston' } }
      const stubbedSend = sinon.stub()
      const response = { send: stubbedSend }

      stubbedFindOne.returns(singleVillain)

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'gaston' } })
      expect(stubbedSend).to.have.been.calledWith(singleVillain)
    })

    it('returns a 404 when no villains is found', async () => {
      stubbedFindOne.returns(null)
      const request = { params: { slug: 'not-found' } }


      await getVillainBySlug(request, response)
      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'not-found' } })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })
    it('returns a 500 when no villains is found', async () => {
      stubbedFindOne.throws('ERROR!')
      const request = { params: { slug: 'not-found' } }


      await getVillainBySlug(request, response)
      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'not-found' } })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Sorry villains by slug could  not found')
    })
  })
  describe('createNewVillain', () => {
    it('accepts and saves new villain details as new villain, returning the saved record with a 201 status', async () => {
      const request = { body: singleVillain }
      const stubbedStatusDotSend = sinon.stub()
      const stubbedStatus = sinon.stub().returns({ send: stubbedStatusDotSend })
      const response = { status: stubbedStatus }

      stubbedCreate.returns(singleVillain)

      await createNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith(singleVillain)
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedStatusDotSend).to.have.been.calledWith(singleVillain)
    })
    it('returns a 500 when no villains is found', async () => {
      stubbedCreate.throws('ERROR!')
      const request = { body: singleVillain }


      await createNewVillain(request, response)
      expect(stubbedCreate).to.have.been.calledWith(singleVillain)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Sorry new villain could not found')
    })
  })
})
