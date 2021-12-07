const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties")

const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at",
})

function list(){
    return knex("movies").select("*");
}

function listMoviesShowing(){
    return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({"mt.is_showing": true})
    .distinct("m.movie_id")
}

function read(movie_id) {
    return knex("movies as m")
    .select("m.*")
    .where({"m.movie_id": movie_id})
    .first()
}

function listTheatersWithMovie(movie_id){
    return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*", "m.movie_id", "mt.is_showing")
    .where({"m.movie_id" : movie_id})
}

function listMovieReviews(movie_id){
    return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({"m.movie_id" : movie_id})
    .then(data => data.map(addCritic))
}

module.exports = {
    read,
    list,
    listMoviesShowing,
    listTheatersWithMovie,
    listMovieReviews,
}