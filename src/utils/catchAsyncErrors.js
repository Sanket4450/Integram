const catchAsyncErrors = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch((err) => {
        console.error(err)
        next(err)
    })
}

module.exports = catchAsyncErrors
