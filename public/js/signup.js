import axios from 'axios'
import { showAlert } from './alert';


export const signUp = async (fdata) => {

    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: fdata
        });
        if(res.data.status==='success'){
            showAlert('success',"You've successfully created account");
            window.setTimeout(()=>{
                location.assign('/account');
            },1000);
        }
    }
    catch(err){
        showAlert('error',err.response.data.message);
        console.log(err.response.data.message);
    }
};
