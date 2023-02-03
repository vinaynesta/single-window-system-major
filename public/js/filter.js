import axios from 'axios'
import { showAlert } from './alert';
import { changeNumberFormat } from './ui/city'
import { updateData } from './updateSettings';



export const filter = async (cityslug,ptype,bath,myage,mysort,priceRange,bhkNum) => {
    let queryStr = "";
    let querties = ["city","type","bath","age","sort","range","bhkvalue"];
    let qfilter = [cityslug,ptype,bath,myage,mysort,priceRange,bhkNum];
    
    for(let i=0;i<7;i++){
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
    let myqueryStr = `/${cityslug}` + queryStr;

    try{
        const res = await axios({
            method: 'GET',
            url: `/api/v1/properties${queryStr}`,
        });
        if(res.data.status === 'Success'){
            const results = res.data.result;
            //console.log(results);
            $(function(){
                $("#newFilter").load(`/myfilter${myqueryStr}`, () => {
                    document.getElementById("mylength").innerHTML = results;
                    for (var countMouney = 0; countMouney < results; countMouney++) {
                        let price = parseInt(document.getElementById(`price${countMouney}a`).innerHTML);
                        document.getElementById(`price${countMouney}a`).innerHTML = changeNumberFormat(price)
                    }
                
                    for (var countMouney = 0; countMouney < results; countMouney++) {
                        let price = parseInt(document.getElementById(`emi${countMouney}a`).innerHTML);
                        document.getElementById(`emi${countMouney}a`).innerHTML = "₹ " + changeNumberFormat(price) + '/Month'
                    }
                    $(".old").hide();
                    $(".new").show();
                });
                
                
            })
        }
        else{
            showAlert('error','enter again.');
        }
       
    }
    catch{
        showAlert('error','something went Wrong.');
    }
}

export const mypass = async () => {
    try{
        $(function(){
            $('.mycontainer').load('/profile/password', () =>{
                const userPasswordForm = document.querySelector('.form-user-settings');
                if (userPasswordForm) {
    
                    userPasswordForm.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const passwordCurrent = document.getElementById('password-current').value;
                        const password = document.getElementById('password').value;
                        const passwordConfirm = document.getElementById('password-confirm').value;
                        await updateData({passwordCurrent,password, passwordConfirm}, 'password');
                    });
                }
            })
        })
    }
    catch{
        showAlert('error','something went Wrong.');
    }
}
