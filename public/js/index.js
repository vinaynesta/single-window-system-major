import { login } from './login';
import { logout } from './login';
import '@babel/polyfill';
import { signUp } from './signup';
import { updateData, updateRates, verifyUser } from './updateSettings';
import { updateC } from './updateCoins';
import { createData }  from './newProperty'
import { showAlert } from './alert'
import { registrationSWS } from './registrationSWS'

const signupForm = document.querySelector("#sign-up-form");

if (signupForm){
    $("#signup-submit").click(()=>{
        let a=JSON.stringify($('#sign-up-form').serialize()) 
        let res = a.replace(/=/g, '":"');
        res= res.replace(/&/g,'","')
        res= res.replace(/%40/g,'@')
        res= res.replace(/%20/g,' ')
        let c = '{'+res+'}'
        const data = JSON.parse(c)
        //console.log(data)  

        //console.log(data.password,data.passwordConfirm);
        if (data.password === data.passwordConfirm){
            signUp(data)
        }
        else{
            showAlert("error","Your Passwords don't match")
        }

    })
}


// login settings (login and log-out)

const acc = document.querySelector(".user-details");
if (acc){
    $("#user").click(()=>{
        location.assign("/account")
    })
}
const prof = document.querySelector(".user-details");
if (prof){
    $("#user-profile").click(()=>{
        location.assign("/profile")
    })
}



const loginForm = document.querySelector("#login-form");
const logoutBtn = document.querySelector('#logout-button');

if (loginForm) {

    $("#login-button").click(()=>{
        let a=JSON.stringify($('#login-form').serialize()) 
        let res = a.replace(/=/g, '":"');
        res= res.replace(/&/g,'","')
        res= res.replace(/%40/g,'@')
        let c = '{'+res+'}'
        const loginData = JSON.parse(c)
        console.log(loginData,res,a)  

        login(loginData)
    })
}

const registrationFormSWS = document.querySelector("#register-formsws");
const registerSWSbtn = document.querySelector('#registrationSWS-button');

if (registrationFormSWS) {

    $("#registrationSWS-button").click(()=>{
        let a=JSON.stringify($('#register-formsws').serialize()) 
        let res = a.replace(/=/g, '":"');
        res= res.replace(/&/g,'","')
        res= res.replace(/%40/g,'@')
        let c = '{'+res+'}'
        const registrationSWSData = JSON.parse(c)
        console.log(registrationSWSData)
        console.log(registrationSWSData,res,a)  

        registrationSWS(registrationSWSData)
    })
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}


const editDetails = document.querySelector("#ep1");

if (editDetails){
    $("#edit-details").click(()=>{
        let a=JSON.stringify($('#ep11').serialize()) 
        let res = a.replace(/=/g, '":"');
        res= res.replace(/&/g,'","')
        res= res.replace(/%20/g,' ')
        res= res.replace(/%40/g,'@')
        let c = '{'+res+'}'
        let editData = JSON.parse(c)

        const form = new FormData();
        form.append('photo', document.getElementById('photo').files[0]);

        for (const i in editData) {
            form.append(`${i}`, editData[i]);
          }
        //console.log(form)  
        updateData(form)
    })
}

let searchParams = new URLSearchParams(window.location.search)

if(searchParams.has('coins')){
    let param = searchParams.get('coins')
    $("#numberOfCoins").val(param)
}
if(searchParams.has('name')){
    console.log("hii");
    let param = searchParams.get('name')
    param = param.replace(/%20/g, " ");
    $("#orderName").text(param)
}


$("#pay").click(() =>{
        
        
        let c =  $("#numberOfCoins").val()
        c = parseFloat(c)
        let rpuba =  $("#receiverPublicAddress").val()
        let spuba = $("#puk").attr("data-publickey")
        let name = $("#orderName").text()
        const fdata = {receiverPublicAddress:rpuba,senderPublicAddress:spuba,sentCoins:c,name:name}
        //console.log(fdata);
       updateC(fdata);
    
})

for(let i=0;i<6;i++){
    $(`#b${i}`).click( ()=>{
        let name = $(`#ab${i}`).data("name")
        let coins = $(`#ab${i}`).data("coins")
        coins = parseInt(coins)
        location.assign(`/paymerchant?coins=${coins}&name=${name}`)
    })
}

//  ----------------------------  SIH -------------------


const regis = document.querySelector("#registration");

if(regis){
    $("#registration").click( () => {
        let a=JSON.stringify($('#register-form').serialize()) 
        let res = a.replace(/=/g, '":"');
        res= res.replace(/&/g,'","')
        let c = '{'+res+'}'
        const data = JSON.parse(c)
        //console.log(c,data);
        createData(data,"register")
    })
}

const zone = document.querySelector("#zone")

if(zone){
    let ide = ""
    const hideDiv = id => {
        $("#ps1").hide()
        $("#ep1").hide()
        $("#dss1").hide()
        $("#ct1").hide()
        $("#cx1").hide()
        $(id).show()
    }
    
    $("#zone").click( () => {
        let a=JSON.stringify($('#zone-form').serialize()) 
        let res = a.replace(/=/g, '":"');
        res= res.replace(/&/g,'","')
        let c = '{'+res+'}'
        const data = JSON.parse(c)
        console.log(data);
        //createData(data,"rates")
        //console.log(ide);

        updateRates(data,ide)
    })

    $("#ps").click( () => { 
        hideDiv("#ps1") 
        $(".hero").hide()
        $("#thisID").html("id")
        $("#zone").hide()
    })
    $("#ep").click( () => { hideDiv("#ep1") })
    $("#dss").click( () => { hideDiv("#dss1") })
    $("#ct").click( () => { hideDiv("#ct1") })
    $("#cx").click( () => { hideDiv("#cx1") })

    $("#zoned").click( () => {
        let zid = $("#zoneId").val()

        if(zid == ""){
            showAlert("error","Enter Zone id")
        }
        else{
            let n = "#fuck" + zid
            let a = $(n).data("fap")
            $(".hero").show()
            hideDiv("#ep1")
            $("#thisID").html(zid)
            for (const [key, value] of Object.entries(a)) {
                $(`input[name="${key}"]`).val(`${value}`)
              }
              
              ide = a.id
              $("#zone").show()
        }
         
    })
}


const passform = document.querySelector("#pass-form")

if(passform){
    $("#continue").click( () => {
        let a=JSON.stringify($('#pass-form').serialize()) 
        let res = a.replace(/=/g, '":"');
        res= res.replace(/&/g,'","')
        let c = '{'+res+'}'
        const data = JSON.parse(c)
        
        let ide =""
        let searchParams = new URLSearchParams(window.location.search)
        if(searchParams.has('id')){
            ide = searchParams.get('id')
        } 
        let amt = $("#amt").data("amt")
        verifyUser(data,ide,amt)
    } )
}
