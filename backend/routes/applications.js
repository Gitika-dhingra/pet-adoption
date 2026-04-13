const express = require('express')
const { verifyToken } = require('../middleware/auth')
const AdoptionApplication = require('../models/adoptionApplication')

const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      petId,
      fullName,
      email,
      phone,
      address,
      housingType,
      hasYard,
      hasOtherPets,
      otherPetsDetails,
      experience,
      whyAdopt,
    } = req.body

    if (!petId || !fullName || !email || !phone || !address || !whyAdopt) {
      return res.status(400).json({ error: 'Missing required application fields.' })
    }

    const application = await AdoptionApplication.create({
      petId,
      userId: req.user.id,
      fullName,
      email,
      phone,
      address,
      housingType,
      hasYard: Boolean(hasYard),
      hasOtherPets: Boolean(hasOtherPets),
      otherPetsDetails: otherPetsDetails || '',
      experience: experience || '',
      whyAdopt,
      status: 'pending',
    })

    res.json({ application })
  } catch (error) {
    res.status(500).json({ error: 'Unable to create adoption application.' })
  }
})

module.exports = router
