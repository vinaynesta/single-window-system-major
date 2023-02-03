import axios from 'axios';
import { atomicMassDependencies } from 'mathjs';
import { showAlert } from './alert';

export const updateData = async (data,type)=>{
    try{
        const url = type === 'password' ? '/api/v1/users/updatemypassword' : '/api/v1/users/updateme';

        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if(res.data.status==='success'){
            showAlert('success','Data Updated Successfully');
            if (type =="cpin" || type=="coins"){
                location.assign("/account")
            }
        }


        
    }
    catch(err){
        showAlert('error',err.response.data.message);
        console.log(err.response.data.message);
    }
}
  
export const updateRates = async (data,id)=>{
    try{

        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/rates?id=${id}`,
            data,
        });

        if(res.data.status==='success'){
            showAlert('success','Data Updated Successfully');
            // if (type =="cpin" || type=="coins"){
            //     location.assign("/account")
            // }
        }


        
    }
    catch(err){
        showAlert('error',err.response.data.message);
        console.log(err.response.data.message);
    }
}
  
export const verifyUser = async (data,ide,amt)=>{
    try{

        const res = await axios({
            method: 'POST',
            url: `/api/v1/users/verifyuser`,
            data,
        });

        if(res.data.status==='success'){
            let d = {senderPublicAddress:ide,amount:amt}
            const res1 = await axios({
                method: 'POST',
                url: `/api/v1/ledger/`,
                data:d,
            });
            if(res1.data.status==='success'){
                
                //console.log(res1.data.data);
                
                const res2 = await axios({
                    method:'PATCH',
                    url: `/api/v1/properties?id=${ide}`,
                    data: {status:1}
                })
                if(res2.data.status==='success'){
                    showAlert("success","Block added successfully")
                    location.assign("/transaction")
                }
            }
    
        }
        
    }
    catch(err){
        showAlert('error',err.response.data.message);
        console.log(err.response.data.message);
    }
}
  
