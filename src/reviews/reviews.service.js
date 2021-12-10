const knex = require("../db/connection");
const addCritic = require("../utils/add-critic");

function read(review_id) {
    return knex("reviews").select("*").where({ review_id }).first();
}

function readReviews(review_id){
    return knex("reviews as r")
    .select("r.*", "c.*", "c.created_at as critics_created_at", "c.updated_at as critics_updated_at")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .where({ review_id })
    .first()
    .then(addCritic)
}

function update(updatedReview){
    return knex("reviews as r")
        .where({ review_id: updatedReview.review_id })
        .update(updatedReview, "*")
}

function destroy(review_id) {
    return knex ("reviews as r") 
    .where({ review_id })
    .del()
}

module.exports = {
    read,
    update,
    readReviews,
    delete: destroy,
}