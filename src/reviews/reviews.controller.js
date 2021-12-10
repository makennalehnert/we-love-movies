const knex = require("../db/connection")
const reviewsService = require("./reviews.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = [
    "content",
    "score",
    "created_at",
    "updated_at",
    "critic_id",
    "movie_id",
];

function hasOnlyValidProperties(req, res, next){
    const { data = {} } = req.body;
    const invalidFields = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field));
    if(invalidFields.length){
        return next ({
            status: 400,
            message: `Invalid field(s): ${invalidFields.join(", ")}`,
        })
    }
    next();
}

async function reviewExists(req, res, next) {
    const review = await reviewsService.read(req.params.reviewId);
    if (review) {
      res.locals.review = review;
      return next();
    }
    next({ status: 404, message: "Review cannot be found." });
  }

async function update(req, res, next){
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id,
    };
    await reviewsService.update(updatedReview);
    const data = await reviewsService.readReviews(req.params.reviewId)
    res.json({data})
}

async function destroy(req, res, next){
    const { review } = res.locals
    await reviewsService.delete(review.review_id)
    res.sendStatus(204)
}

module.exports = {
    update: [
        asyncErrorBoundary(reviewExists),
        hasOnlyValidProperties,
        asyncErrorBoundary(update),
    ],
    delete: [asyncErrorBoundary(reviewExists),
            asyncErrorBoundary(destroy)
    ],
}