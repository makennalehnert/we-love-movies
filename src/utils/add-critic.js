const mapProperties = require("./map-properties")

const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    critics_created_at: "critic.created_at",
    critics_updated_at: "critic.updated_at",
})

module.exports = addCritic;