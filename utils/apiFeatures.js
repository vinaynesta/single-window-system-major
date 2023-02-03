class APIFeatures{
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['aadhar',"id"];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|eq|or)\b/g, match => `$${match}`);
    // console.log(queryObj);
    // console.log(queryStr);
    // console.log(JSON.parse(queryStr));

    //this.query = this.query.find({ $or: [ { bhkType: 1 }, { bhkType: 2 } ] });
    this.query = this.query.find(JSON.parse(queryStr));
    //this.query = this.query.find({ bhkType: [ 1, 2 ] });

    return this;
  }
        
  afind() {
    if(this.queryString.aadhar){
      const city = `{"aadharId":{ "$eq": "${this.queryString.aadhar}" }}`;
      this.query = this.query.find(JSON.parse(city));
    }
    return this;
  }

  bfind() {
    if(this.queryString.id){
      //console.log("hiiii",this.queryString.id);
      const city = `{"id":{ "$eq": "${this.queryString.id}" }}`;
      this.query = this.query.find(JSON.parse(city));
    }
    return this;
  }
    

}

module.exports = APIFeatures;

