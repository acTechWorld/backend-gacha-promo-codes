// Promo Codes
const express = require('express');
const router = express.Router();
const promoCodeRepository = require('../repositories/promoCodeRepository');
const promoCodeAwardsDescriptionRepository = require('../repositories/promoCodeAwardsDescriptionRepository');
const promoCodeAwardsDetailsRepository = require('../repositories/promoCodeAwardsDetailsRepository');

router.get('/promo-codes', async (req, res) => {
    try {
      // Fetch all promo codes
      const [promoCodes] = await promoCodeRepository.getAllPromoCodes();
      console.log("yo")

      // Fetch all promo code Awards descriptions and details
      const [promoCodeAwardsDescriptions] = await promoCodeAwardsDescriptionRepository.getAllPromoCodeAwardsDescriptions();
      const [promoCodeAwardsDetails] = await promoCodeAwardsDetailsRepository.getAllPromoCodeAwardsDetails();
  
      // Create a map to easily access descriptions and details by promo code ID
      const descriptionMap = new Map();
      promoCodeAwardsDescriptions.forEach(desc => {
        descriptionMap.set(desc.id, desc.description);
      });
  
      const detailsMap = new Map();
      promoCodeAwardsDetails.forEach(detail => {
        if (!detailsMap.has(detail.promo_code_id)) {
          detailsMap.set(detail.promo_code_id, []);
        }
        detailsMap.get(detail.promo_code_id).push({
          label: detail.label,
          count: detail.count
        });
      });
  
      // Merge promo codes with their descriptions and details
      const result = promoCodes.map(promoCode => {
        return {
          id: promoCode.id,
          code: promoCode.code,
          description: promoCode.description,
          creationDate: promoCode.created_at,
          modificationDate: promoCode.updated_at,
          awardDescription: descriptionMap.get(promoCode.award_id) || null,
          awardDetails: detailsMap.get(promoCode.id) || []
        };
      });
  
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.post('/promo-codes', async (req, res) => {
  try {
      // Extracting data from the request body
      const { code, description, awardDescription, awardDetails } = req.body;

      // Step 1: Insert the new promo code into the promo_codes table
      const [newPromoCode] = await promoCodeRepository.createPromoCode({
          code,
          description
      });

      // Step 2: Insert the award description into the promo_code_awards_descriptions table
      const [newAwardDescription] = await promoCodeAwardsDescriptionRepository.createPromoCodeAwardsDescription({
          promoCodeId: newPromoCode.id,
          description: awardDescription
      });

      // Step 3: Insert the award details into the promo_code_awards_details table
      for (const detail of awardDetails) {
          await promoCodeAwardsDetailsRepository.createPromoCodeAwardsDetail({
              promoCodeId: newPromoCode.id,
              label: detail.label,
              count: detail.count
          });
      }

      // Fetch the newly created promo code with its details to return in the response
      const createdPromoCode = {
          id: newPromoCode.id,
          code: newPromoCode.code,
          description: newPromoCode.description,
          creationDate: newPromoCode.created_at,
          modificationDate: newPromoCode.updated_at,
          awardDescription: newAwardDescription.description,
          awardDetails: awardDetails
      };

      // Return the created promo code with a 201 status
      res.status(201).json(createdPromoCode);

  } catch (err) {
      // Handle any errors and respond with a 500 status code
      res.status(500).json({ error: err.message });
  }
});

router.get('/promo-codes/:id', async (req, res) => {
  try {
      // Extract the promo code ID from the request parameters
      const promoCodeId = req.params.id;

      // Step 1: Fetch the promo code by its ID
      const [promoCode] = await promoCodeRepository.getPromoCodeById(promoCodeId);

      // Check if the promo code exists
      if (!promoCode) {
          return res.status(404).json({ error: 'Promo code not found' });
      }

      // Step 2: Fetch the award description related to the promo code
      const [awardDescription] = await promoCodeAwardsDescriptionRepository.getPromoCodeAwardsDescriptionByPromoCodeId(promoCodeId);

      // Step 3: Fetch the award details related to the promo code
      const [awardDetails] = await promoCodeAwardsDetailsRepository.getPromoCodeAwardsDetailsByPromoCodeId(promoCodeId);

      // Step 4: Construct the result object
      const result = {
          id: promoCode.id,
          code: promoCode.code,
          description: promoCode.description,
          creationDate: promoCode.created_at,
          modificationDate: promoCode.updated_at,
          awardDescription: awardDescription ? awardDescription.description : null,
          awardDetails: awardDetails || []
      };

      // Return the result as JSON
      res.json(result);

  } catch (err) {
      // Handle any errors and respond with a 500 status code
      res.status(500).json({ error: err.message });
  }
});

router.delete('/promo-codes/:id', async (req, res) => {
  try {
      // Extract the promo code ID from the request parameters
      const promoCodeId = req.params.id;

      // Attempt to delete the promo code from the database
      const deleteResult = await promoCodeRepository.deletePromoCodeById(promoCodeId);

      // Check if the promo code was found and deleted
      if (deleteResult.affectedRows === 0) {
          return res.status(404).json({ error: 'Promo code not found' });
      }

      // Return a success message
      res.status(200).json({ message: 'Promo code deleted successfully' });

  } catch (err) {
      // Handle any errors and respond with a 500 status code
      res.status(500).json({ error: err.message });
  }
});

router.put('/promo-codes/:id', async (req, res) => {
  try {
      // Extract the promo code ID from the request parameters
      const promoCodeId = req.params.id;

      // Extract the updated data from the request body
      const { code, description, awardDescription, awardDetails } = req.body;

      // Step 1: Update the promo code in the promo_codes table
      const updateResult = await promoCodeRepository.updatePromoCodeById(promoCodeId, {
          code,
          description
      });

      // Check if the promo code was found and updated
      if (updateResult.affectedRows === 0) {
          return res.status(404).json({ error: 'Promo code not found' });
      }

      // Step 2: Update the award description in the promo_code_awards_descriptions table
      await promoCodeAwardsDescriptionRepository.updatePromoCodeAwardsDescriptionByPromoCodeId(promoCodeId, {
          description: awardDescription
      });

      // Step 3: Delete existing award details related to the promo code
      await promoCodeAwardsDetailsRepository.deletePromoCodeAwardsDetailsByPromoCodeId(promoCodeId);

      // Step 4: Insert the updated award details into the promo_code_awards_details table
      for (const detail of awardDetails) {
          await promoCodeAwardsDetailsRepository.createPromoCodeAwardsDetail({
              promoCodeId,
              label: detail.label,
              count: detail.count
          });
      }

      // Fetch the updated promo code with its details to return in the response
      const updatedPromoCode = {
          id: promoCodeId,
          code,
          description,
          creationDate: updateResult.created_at,
          modificationDate: new Date(),
          awardDescription,
          awardDetails
      };

      // Return the updated promo code with a 200 status
      res.status(200).json(updatedPromoCode);

  } catch (err) {
      // Handle any errors and respond with a 500 status code
      res.status(500).json({ error: err.message });
  }
});





module.exports = router;