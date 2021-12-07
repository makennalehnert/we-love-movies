const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next){
    const movie = await moviesService.read(req.params.movieId);
    if (movie) {
        res.locals.movie = movie;
        return next();
    }
    next({
        status: 404,
        message: "Movie cannot be found."
    })
}

function read(req, res, next){
    const { movie: data} = res.locals;
    res.json({data});
}

async function list(req, res, next){
    const data = await moviesService.list();
    const dataShowing = await moviesService.listMoviesShowing();
    if(req.query.is_showing){
        res.json({data: dataShowing})
    }
    res.json({ data })
}

async function listTheatersWithMovie(req, res, next){
    const data = await moviesService.listTheatersWithMovie(req.params.movieId)
    res.json({data})
}

async function listMovieReviews(req, res, next){
    const data = await moviesService.listMovieReviews(req.params.movieId)
    res.json({data})
}

module.exports = {
    read: [asyncErrorBoundary(movieExists), read],
    list: asyncErrorBoundary(list),
    listTheatersWithMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheatersWithMovie)],
    listMovieReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listMovieReviews)],
}