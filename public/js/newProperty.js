import axios from 'axios';
import { showAlert } from './alert';

export const createData = async (data,type) => {
    try{
        if(type == "register"){
            let id = "" 
            let uid = ""
            const res = await axios({
                method: 'POST',
                url: '/api/v1/properties',
                data,
            });
            if(res.data.status==='success'){
                
                id = res.data.data.data.id
                
                console.log(id,data.aadharId);

                const user = await axios({
                    method: 'GET',
                    url: `/api/v1/users/aadharidsearch?aadharId=${data.aadharId}`,
                    data,
                });

                if(user.data.status == "Success"){
                    let fdata = {user : user.data.data.data[0].id}
                    uid = user.data.data.data[0].id
                    const updateProp = await axios({
                        method: 'PATCH',
                        url: `/api/v1/properties?id=${id}`,
                        data: fdata,
                    });
                    //console.log("lolls",updateProp.data);
                    if(updateProp.data.status==='success'){
                        let p = updateProp.data.data.id
                        let u = updateProp.data.data.user
                        const updateUser = await axios({
                            method: 'PATCH',
                            url: `/api/v1/users/updateasset?pid=${p}&uid=${u}`,
                            data,
                        });
                        if(updateUser.data.status==='success'){

                            showAlert('success','Property Created Successfully');
                            location.assign("/account")
                        }
                        else{
                            showAlert('error',err.response.data.message);
                            console.log(err.response.data.message);
                        }
                    }
                }

            }
            // .aadharId
        }
        if(type == "rates"){
            //console.log("hiiii");
            const res = await axios({
                method: 'POST',
                url: '/api/v1/rates',
                data,
            });
            if(res.data.status==='success'){
                showAlert('success','Interest rates Created Successfully');
            }
        }

        
    }
    catch(err){
        showAlert('error',err.response.data.message);
        console.log(err.response.data.message);
    }
}
