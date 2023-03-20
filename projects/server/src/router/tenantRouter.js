const { tokenVerify } = require("../config/encrypt");
const {uploader} = require("../config/uploader");
const route = require("express").Router();
const { tenantController } = require("../controller");


route.post("/signup/new-tenant", uploader("/ktpImg", "IMGKTP").array('images', 1), tenantController.registerTenant);
route.post("/tenant/properties", tokenVerify, tenantController.getPropertyData)
route.post("/tenant/transaction", tokenVerify, tenantController.getTransaction)

module.exports = route