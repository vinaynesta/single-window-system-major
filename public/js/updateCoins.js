import axios from 'axios'
import { showAlert } from './alert';


export const updateC = async (fdata) => {

    try{
        const res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/updatecoins',
            data: fdata
        });
        if(res.data.status==='success'){
            showAlert('success',"You've successfully transfered coins");
            window.setTimeout(()=>{
                location.assign('/orders');
            },1000);
        }
    }
    catch(err){
        showAlert('error',err.response.data.message);
        console.log(err.response.data.message);
    }
};

