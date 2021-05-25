const express = require('express');
const asyncHandler = require('express-async-handler');
const {
  getCocktailsAndPrices,
  getZutaten,
  deleteCocktail,
  addCocktail,
  updateCocktail,
} = require('../model/schweanze');

const router = express.Router();

router.get(
  '/cocktails',
  asyncHandler(async (req, res) => {
    const { code, data } = await getCocktailsAndPrices(req.query);
    res.status(code).json(data);
  }),
);

router.get(
  '/cocktails/:name/zutaten',
  asyncHandler(async (req, res) => {
    const { code, data } = await getZutaten(req.params.name);
    res.status(code).json(data);
  }),
);

router.delete(
  '/cocktails/:name',
  asyncHandler(async (req, res) => {
    const { code, data } = await deleteCocktail(req.params.name);
    res.status(code).json(data);
  }),
);

router.post(
  '/cocktails',
  asyncHandler(async (req, res) => {
    const { code, data } = await addCocktail(req.body);
    res.status(code).json(data);
  }),
);

router.patch(
  '/cocktails/:name',
  asyncHandler(async (req, res) => {
    const { code, data } = await updateCocktail(req.body, req.params.name);
    res.status(code).json(data);
  }),
);

module.exports = router;
