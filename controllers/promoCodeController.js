// Promo Codes
const express = require('express');
const router = express.Router();
const promoCodeRepository = require('../repositories/promoCodeRepository');
const promoCodeAwardsDetailsRepository = require('../repositories/promoCodeAwardsDetailsRepository');
const awardItemRepository = require('../repositories/awardItemRepository');

router.get('/promo-codes', async (req, res) => {
    try {
      // Fetch all promo codes
      const [promoCodes] = await promoCodeRepository.getAllPromoCodes();

      // Fetch all promo code Awards descriptions and details
      const [promoCodeAwardsDetails] = await promoCodeAwardsDetailsRepository.getAllPromoCodeAwardsDetails();

      // Fetch all award items
      const [awardItems] = await awardItemRepository.getAllAwardItems();

    
        // Create a map of award items by ID
        const itemInfoMap = new Map();
        awardItems.forEach(item => {
            itemInfoMap.set(item.id, {
                label: item.label,
                image: item.image,
                application: item.application
            });
        });

      const detailsMap = new Map();
      promoCodeAwardsDetails.forEach(detail => {
        if (!detailsMap.has(detail.promo_code_id)) {
          detailsMap.set(detail.promo_code_id, []);
        }
        const itemInfo = itemInfoMap.get(detail.award_item_id)
        detailsMap.get(detail.promo_code_id).push({
          awardItemId: detail.award_item_id,
          label: itemInfo?.label || detail.label,
          image: itemInfo?.image,
          count: detail.count
        });
      });
  
      // Merge promo codes with their descriptions and details
      const result = promoCodes.map(promoCode => {
        return {
          id: promoCode.id,
          application: promoCode.application,
          code: promoCode.code,
          description: promoCode.description,
          status: promoCode.status,
          creationDate: promoCode.created_at,
          modificationDate: promoCode.updated_at,
          upVote: promoCode.up_vote,
          downVote: promoCode.down_vote,
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
      const { application, code, description, awardDetails, status, upVote, downVote } = req.body;

      // Step 1: Insert the new promo code into the promo_codes table
      const [resultSetHeader] = await promoCodeRepository.createPromoCode({
          application,
          code,
          status,
          description,
          upVote,
          downVote,
      });

       // Extract the new promo code ID from the resultSetHeader
       const newPromoCodeId = resultSetHeader.insertId;

      // Step 3: Insert the award details into the promo_code_awards_details table
      for (const detail of awardDetails) {
          await promoCodeAwardsDetailsRepository.createPromoCodeAwardsDetail({
              promo_code_id: newPromoCodeId,
              award_item_id: detail.awardItemId,
              label: detail.label,
              count: detail.count
          });
      }

      // Fetch the newly created promo code with its details to return in the response
      const createdPromoCode = {
        id: newPromoCodeId,
        application,
        code,
        status,
        description,
        awardDetails,
        upVote,
        downVote,
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
      const promo_code_id = req.params.id;

      // Step 1: Fetch the promo code by its ID
      const [[promoCode]] = await promoCodeRepository.getPromoCodeById(promo_code_id);

      // Check if the promo code exists
      if (!promoCode) {
          return res.status(404).json({ error: 'Promo code not found' });
      }

      // Step 3: Fetch the award details related to the promo code
      let [awardDetails] = await promoCodeAwardsDetailsRepository.getPromoCodeAwardsDetailsByPromoCodeId(promo_code_id);

        // Fetch all award items
        const [awardItems] = await awardItemRepository.getAwardItemsByApplication(promoCode.application);

      awardDetails = awardDetails.map(detail => {
        const itemInfo = awardItems.find(item => item.id === detail.award_item_id);
        return {
            awardItemId: detail.award_item_id,
            label: itemInfo?.label || detail.label,
            image: itemInfo?.image,
            count: detail.count
          }
      });
      // Step 4: Construct the result object
      const result = {
          id: promoCode.id,
          application: promoCode.application,
          code: promoCode.code,
          description: promoCode.description,
          upVote: promoCode.up_vote,
          downVote: promoCode.down_vote,
          creationDate: promoCode.created_at,
          modificationDate: promoCode.updated_at,
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

      // Step 1: Delete the related award details
      await promoCodeAwardsDetailsRepository.deletePromoCodeAwardsDetailsByPromoCodeId(promoCodeId);

      // Step 3: Delete the promo code itself
      const deleteResult = await promoCodeRepository.deletePromoCode(promoCodeId);

      // Check if the promo code was found and deleted
      if (deleteResult.affectedRows === 0) {
          return res.status(404).json({ error: 'Promo code not found' });
      }

      // Return a success message
      res.status(200).json({ message: 'Promo code and its details deleted successfully' });

  } catch (err) {
      // Handle any errors and respond with a 500 status code
      res.status(500).json({ error: err.message });
  }
});

router.put('/promo-codes/:id', async (req, res) => {
  try {
      // Extract the promo code ID from the request parameters
      const promo_code_id = req.params.id;

      // Extract the updated data from the request body
      const { application, code, description, awardDetails, status, upVote, downVote } = req.body;

      // Step 1: Update the promo code in the promo_codes table
      const [updateResult] = await promoCodeRepository.updatePromoCode(promo_code_id, {
          application,
          code,
          status,
          description,
          awardDetails,
          upVote,
          downVote
      });

      // Check if the promo code was found and updated
      if (updateResult.affectedRows === 0) {
          return res.status(404).json({ error: 'Promo code not found' });
      }

      // Step 3: Delete existing award details related to the promo code
      await promoCodeAwardsDetailsRepository.deletePromoCodeAwardsDetailsByPromoCodeId(promo_code_id);

      // Step 4: Insert the updated award details into the promo_code_awards_details table
      for (const detail of awardDetails) {
          await promoCodeAwardsDetailsRepository.createPromoCodeAwardsDetail({
              promo_code_id,
              award_item_id: detail.awardItemId,
              label: detail.label,
              count: detail.count
          });
      }

      // Fetch the updated promo code with its details to return in the response
      const updatedPromoCode = {
          id: promo_code_id,
          application,
          code,
          description,
          awardDetails,
          upVote,
          downVote
      };

      // Return the updated promo code with a 200 status
      res.status(200).json(updatedPromoCode);

  } catch (err) {
      // Handle any errors and respond with a 500 status code
      res.status(500).json({ error: err.message });
  }
});

router.get('/promo-codes/application/:application', async (req, res) => {
  try {
      // Extract the application from the request parameters
      const application = req.params.application;

      // Fetch all promo codes for the specified application
      const [promoCodes] = await promoCodeRepository.getPromoCodesByApplication(application);

      // If no promo codes are found, return an empty array
      if (promoCodes.length === 0) {
          return res.status(404).json({ message: 'No promo codes found for this application' });
      }

      // Fetch all promo code award details
      const [promoCodeAwardsDetails] = await promoCodeAwardsDetailsRepository.getAllPromoCodeAwardsDetails();

       // Fetch all award items
       const [awardItems] = await awardItemRepository.getAwardItemsByApplication(application);

       // Create a map of award items by ID
       const itemInfoMap = new Map();
       awardItems.forEach(item => {
           itemInfoMap.set(item.id, {
               label: item.label,
               image: item.image,
               application: item.application
           });
       });

      const detailsMap = new Map();
      promoCodeAwardsDetails.forEach(detail => {
          if (!detailsMap.has(detail.promo_code_id)) {
              detailsMap.set(detail.promo_code_id, []);
          }
          const itemInfo = itemInfoMap.get(detail.award_item_id)
        detailsMap.get(detail.promo_code_id).push({
          awardItemId: detail.award_item_id,
          label: itemInfo?.label || detail.label,
          image: itemInfo?.image,
          count: detail.count
        });
      });

      // Merge promo codes with their details
      const result = promoCodes.map(promoCode => {
          return {
              id: promoCode.id,
              code: promoCode.code,
              description: promoCode.description,
              status: promoCode.status,
              creationDate: promoCode.created_at,
              modificationDate: promoCode.updated_at,
              application: promoCode.application,
              upVote: promoCode.up_vote,
              downVote: promoCode.down_vote,
              awardDetails: detailsMap.get(promoCode.id) || []
          };
      });

      // Return the result as JSON
      res.json(result);

  } catch (err) {
      // Handle any errors and respond with a 500 status code
      res.status(500).json({ error: err.message });
  }
});





module.exports = router;