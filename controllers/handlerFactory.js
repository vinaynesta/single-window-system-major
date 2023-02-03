// this contains all general files like crud operations instead of creating different functions

// more of a general functions were all operations are hanadled here

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const slugify = require('slugify');

exports.deleteOne = Model => catchAsync( async (req,res,next) => {

    const doc= await Model.findByIdAndDelete(req.params.id);

    if(!doc){
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
        status:'Success',
        data: null
    });
});

exports.insertOne = Model => catchAsync( async (req,res,next) => {

    const doc = await Model.insertMany(req.params.id, req.body);

    if(!doc){
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: {
          data: doc
        }
    });
    
})

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });



exports.createOne = Model => catchAsync( async (req,res)=>{

    const doc = await Model.create(req.body);
        res.status(201).json({
            status:'success',
            data: {
                data: doc
            }
        });
});

exports.getOne = Model => catchAsync( async (req,res,next)=>{

  if(req.query.id){
    const doc= await Model.findById(req.query.id)
    console.log(doc.length);
    res.status(200).json({
      status: 'Success',
      data: {
        data: doc
    }
  });
    
  }
  else{

    const doc= await Model.find(req.query)

    // send query 
      
    res.status(200).json({
      status: 'Success',
      data: {
        data: doc
    }
  });
  }

});

exports.getAll = Model => catchAsync( async (req,res)=>{

    let filter ={};
    if(req.params.ide) {
        filter = {id: req.params.ide};
    }

    const features = new APIFeatures(Model.find(filter), req.query)

         // execute query
         const doc = await features.query;
        
          // send query 
          
          res.status(200).json({
            status: 'Success',
            result: doc.length,
            data: {
              data: doc
          }
        });

});

