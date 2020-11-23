const models = require('../models')

const getAllVillains = async (request, response) => {
  try {
    const villains = await models.villains.findAll({
      attributes: ['name', 'movie', 'slug']
    })

    return response.send(villains)
  } catch (error) {
    return response.status(404).send('Sorry not found')
  }
}

const getVillainBySlug = async (request, response) => {
  try {
    const { slug } = request.params

    const foundVillain = await models.villains.findOne({ where: { slug } })

    return response.send(foundVillain)
  } catch (error) {
    return response.status(404).send('Sorry not found')
  }
}

const createNewVillain = async (request, response) => {
  try {
    const { name, movie, slug } = request.body

    if (!name || !movie || !slug) {
      return response.status(400)
    }
    const newVillain = await models.villains.create({ name, movie, slug })

    return response.status(201).send(newVillain)
  }
  catch (error) {
    return response.status(404).send('Sorry not found')
  }
}

module.exports = {
  getAllVillains,
  getVillainBySlug,
  createNewVillain
}
