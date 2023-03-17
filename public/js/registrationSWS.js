import axios from 'axios'
import { showAlert } from './alert';


export const registrationSWS = async (registrationSWSData) => {
    console.log("bujji bangaram")
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/usersws',
            data: registrationSWSData
        });
        if(res.data.status==='success'){
            showAlert('success',"You've successfully entered the Data");
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