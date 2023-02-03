import axios from 'axios';
import { showAlert } from './alert';


const cityFilter = (cities,queryCity,bhkValues,priceValue,pTypeValue) => {
    
    let queryStr = "";
    let querties = ["bhkvalue","range","age"];
    let qfilter = [bhkValues,priceValue,pTypeValue];
    
    for(let i=0;i<3;i++){
        if(qfilter[i] !== ""){
            if(queryStr == ""){
                queryStr = queryStr +'?';
            }
            else{
                queryStr = queryStr + '&';
            }
            queryStr = queryStr + querties[i] + '=' + qfilter[i];
        }
    }
    // console.log(queryStr);

    const mycity = cities.map(getCities);

    function getCities(n){
        return n.citySlug;    
    }
    for(let i=0;i<mycity.length;i++){
        if(`${mycity[i]}`===queryCity){
            location.assign(`/property/${queryCity}${queryStr}`);
            break;
        }
        if((`${mycity[i]}`!==queryCity) && (i==mycity.length-1)){
            showAlert('error','Search some other city.');
        }
    }
}

export const search = async (city,bhkValues,priceValue,pTypeValue) => {

    try{
        const res = await axios({
            method:'GET',
            url:'/api/v1/properties',
        });
        city = city.toLowerCase();
        const results = res.data.data.data;

        cityFilter(results,city,bhkValues,priceValue,pTypeValue);
    }
    catch(err){
        showAlert('error','Something Went Wrong');
    }
}