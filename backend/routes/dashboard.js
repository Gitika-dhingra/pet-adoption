const express = require('express')
const { verifyToken } = require('../middleware/auth')
const AdoptionApplication = require('../models/adoptionApplication')
const InjuryReport = require('../models/injuryReport')
const Pet = require('../models/pet')

const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
  try {
    const applications = await AdoptionApplication.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean()
    const reports = await InjuryReport.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean()

    const petsById = await Pet.find({ id: { $in: applications.map((item) => item.petId) } }).lean()
    const petsMap = Object.fromEntries(petsById.map((pet) => [pet.id, pet]))

    const formattedApplications = applications.map((item) => ({
      id: item._id.toString(),
      status: item.status,
      created_at: item.createdAt.toISOString(),
      pets: petsMap[item.petId]
        ? {
            id: petsMap[item.petId].id,
            name: petsMap[item.petId].name,
            species: petsMap[item.petId].species,
            breed: petsMap[item.petId].breed,
            image_url: petsMap[item.petId].image_url,
          }
        : null,
    }))

    const formattedReports = reports.map((item) => ({
      id: item._id.toString(),
      animal_type: item.animalType,
      description: item.description,
      location: item.location,
      urgency: item.urgency,
      status: item.status,
      created_at: item.createdAt.toISOString(),
    }))

    res.json({
      user: req.user,
      applications: formattedApplications,
      favorites: [],
      reports: formattedReports,
    })
  } catch (error) {
    res.status(500).json({ error: 'Unable to load dashboard data.' })
  }
})

module.exports = router
