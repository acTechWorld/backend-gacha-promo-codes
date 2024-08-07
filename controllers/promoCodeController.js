// Promo Codes
const express = require('express');
const router = express.Router();
const promoCodeRepository = require('../repositories/promoCodeRepository');
const promoCodeValueDescriptionRepository = require('../repositories/promoCodeAwardsDescriptionRepository');
const promoCodeValueDetailsRepository = require('../repositories/promoCodeAwardsDetailsRepository');

router.get('/promo-codes', async (req, res) => {
    try {
      // Fetch all promo codes
      const [promoCodes] = await promoCodeRepository.getAllPromoCodes();
  
      // Fetch all promo code value descriptions and details
      const [promoCodeValueDescriptions] = await promoCodeValueDescriptionRepository.getAllPromoCodeValueDescriptions();
      const [promoCodeValueDetails] = await promoCodeValueDetailsRepository.getAllPromoCodeValueDetails();
  
      // Create a map to easily access descriptions and details by promo code ID
      const descriptionMap = new Map();
      promoCodeValueDescriptions.forEach(desc => {
        descriptionMap.set(desc.id, desc.description);
      });
  
      const detailsMap = new Map();
      promoCodeValueDetails.forEach(detail => {
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
          description: descriptionMap.get(promoCode.value_id) || null,
          details: detailsMap.get(promoCode.id) || []
        };
      });
  
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


module.exports = router;