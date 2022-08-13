import joi from 'joi';

export const createBusinessValidator = joi.object().keys({
  phone_number: joi
    .object({
      countryCode: joi.string().valid('234').max(3).message('Your region is wrong for the phone number now').required(),
      localFormat: joi.string().length(11).message('Wrong Phone number format').required(),
    })
    .required(),
  description: joi.string().min(50).optional(),
  logo: joi.string().uri().optional(),
  name: joi.string().min(3).message('Business Name must have more than 3 Characters').required(),
  owner: joi.number().integer().required(),
});
