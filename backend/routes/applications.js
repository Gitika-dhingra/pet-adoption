const express = require('express')
const { verifyToken, requireRole } = require('../middleware/auth')
const AdoptionApplication = require('../models/adoptionApplication')

const router = express.Router()

router.get('/admin/all', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const applications = await AdoptionApplication.find().sort({ createdAt: -1 }).lean()
    const formatted = applications.map((item) => ({
      id: item._id.toString(),
      petId: item.petId,
      userId: item.userId,
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      address: item.address,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
    }))
    res.json({ applications: formatted })
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch adoption applications.' })
  }
})

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

router.patch('/:id/status', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' })
    }
    const application = await AdoptionApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean()
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' })
    }
    res.json({ application: { id: application._id.toString(), status: application.status } })
  } catch (error) {
    res.status(500).json({ error: 'Unable to update application status.' })
  }
})

module.exports = router
