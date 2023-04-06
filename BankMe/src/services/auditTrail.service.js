const AuditTrail = require("../model/auditTrail");

class AuditTrailService  {
    async createAuditTrail (data) {
    const newAuditTrail  = await AuditTrail.create(data);
    return newAuditTrail;
  }
}

module.exports = new AuditTrailService()

