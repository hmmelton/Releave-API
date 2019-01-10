'use strict';

var crypto = require('crypto');
var key = "Vc5223Vtkoxg9bMmDYVPpjcgU3emKtz/UFxJ80seyWQ";
var text = "n6c1nv+5RDeb/C2pujWa4OjuUMmGWbrIZvgl+sUcG4w";
var secret = crypto.createHmac('sha256', key).update(text).digest('hex');

module.exports = {
	MONGO_DB: "hmmelton:Lampard#8@ds064198.mlab.com:64198/releave",
	STRIPE_SECRET_KEY: "sk_test_SHJopqGq01amSfYJge5ORBTG",
	FACEBOOK_APP_ID: "107305349752171",
	FACEBOOK_APP_SECRET: "5ad69731e83e3da4ec882acc72d14f4f",
	TOKEN_GEN_SECRET: secret
};
//# sourceMappingURL=private_strings.js.map