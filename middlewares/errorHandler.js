function handleErrors(err, req, res, next) {
    console.error(`Error occurred: ${err.message}`);
    res.status(500).send('Something went wrong!');
}

module.exports = { handleErrors };
