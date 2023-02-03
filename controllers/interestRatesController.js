const rates = require('./../models/interestRates')
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.createRates = factory.createOne(rates);


exports.updateRates = catchAsync(async (req,res,next) => { 
    //console.log(req.body);
    const doc = await rates.findByIdAndUpdate(req.query.id, req.body, {
        new: true,
        runValidators: true
      });
  
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
  
      res.status(200).json({
        status: 'success',
        data: doc
      });

      next()
} )

exports.getAllRates =factory.getAll(rates);

exports.delRates = factory.deleteOne(rates);  