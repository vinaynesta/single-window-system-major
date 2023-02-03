import axios from 'axios'
import { showAlert } from './alert';


export const login = async (loginData) => {

    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: loginData
        });
        if(res.data.status==='success'){
            showAlert('success','You are successfully logged in');
            window.setTimeout(()=>{
                location.assign('/account');
            },1000);
        }
    }
    catch(err){
        showAlert('error',err.response.data.message);
    }
};

    

export const logout = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/api/v1/users/logout',
      });
      if (res.data.status = 'success') location.assign('/');
    } catch (err) {
      //console.log(err.response);
      showAlert('error','Error logging out! Try again.');
    }
};

