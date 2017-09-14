'use strict';

const crypto = require('crypto');
const key = "Vc5223Vtkoxg9bMmDYVPpjcgU3emKtz/UFxJ80seyWQ";
const text = "n6c1nv+5RDeb/C2pujWa4OjuUMmGWbrIZvgl+sUcG4w";
const secret = crypto.createHmac('sha256', key).update(text).digest('hex');

module.exports = {
	API_KEY: "4E4F6811-AFF6-4B54-9B27-E47799BE1C55",
	MONGO_DB: "hmmelton:Lampard#8@ds064198.mlab.com:64198/releave",
	STRIPE_SECRET_KEY: "sk_test_SHJopqGq01amSfYJge5ORBTG",
	FACEBOOK_APP_ID: "107305349752171",
	FACEBOOK_APP_SECRET: "5ad69731e83e3da4ec882acc72d14f4f",
	TOKEN_GEN_SECRET: secret
};