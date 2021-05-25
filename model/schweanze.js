/* eslint-disable no-restricted-syntax */
const db = require('../db');

async function getCocktailsAndPrices(query) {
  const { preis } = query;
  if (preis) {
    const { rows } = await db.query(
      'SELECT cname, preis from cocktail where preis <= $1',
      [preis],
    );
    return {
      code: 200,
      data: rows,
    };
  }
  const { rows } = await db.query('SELECT cname, preis from cocktail');
  return {
    code: 200,
    data: rows,
  };
}

async function getZutaten(name) {
  const { rows } = await db.query(
    'SELECT zbez from cocktail c JOIN besteht b on c.cid= b.cid  JOIN zutat USING(zid) where cname = $1;',
    [name],
  );
  return {
    code: 200,
    data: rows,
  };
}

async function deleteCocktail(name) {
  const { rows } = await db.query('SELECT * from cocktail where cname= $1', [
    name,
  ]);
  if (rows.length > 0) {
    await db.query('DELETE from besteht where cid = $1;', [rows[0].cid]);
    await db.query('DELETE from bestellt where cid = $1;', [rows[0].cid]);
    await db.query('DELETE from cocktail where cname = $1;', [name]);
    return {
      code: 200,
      data: 'deleted',
    };
  }
  return {
    code: 404,
    data: `${name} not found`,
  };
}

async function addCocktail(body) {
  const { rows } = await db.query('SELECT Max(cid) as max from cocktail');

  const newId = rows[0].max + 1;
  await db.query(
    'INSERT INTO cocktail (cid,cname,preis,zubereitung,kid,zgid,sgid) VALUES($1,$2,$3,$4,$5,$6,$7)',
    [
      newId,
      body.cname,
      body.preis,
      body.zubereitung,
      body.kid,
      body.zgid,
      body.sgid,
    ],
  );

  return {
    code: 200,
    data: `${newId} added`,
  };
}

async function updateCocktail(body, name) {
  const bodyArray = [];

  // eslint-disable-next-line guard-for-in
  for (const key in body) {
    bodyArray.push(`${key} = '${body[key]}'`);
  }
  await db.query(`UPDATE cocktail SET ${bodyArray.join(',')} where cname= $1`, [
    name,
  ]);

  return {
    code: 200,
    data: `Updated to ${body.preis}`,
  };
}

module.exports = {
  getCocktailsAndPrices,
  getZutaten,
  deleteCocktail,
  addCocktail,
  updateCocktail,
};
