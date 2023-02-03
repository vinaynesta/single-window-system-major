const matchlist = document.getElementById('match-list');



const cityFilter = cities => {
    //console.log(cities);
    if(cities.length>0){
        const myhtml = cities.map(getCities).join('');
        //console.log(myhtml);
            
        function getCities(n){
            if(n.category==='city-town-village' || n.category==='administrative-region'){
                let state = n.highlightedVicinity.split(' ');
                //console.log(state);

                return `<div class="card card-body allSuggestions" onclick="select(this)" data-val="${n.title}">
                <div style="font-size:14px" class="title">${n.title}</div>
                <div style="font-size:12px"> ${n.highlightedVicinity} </div>   
                </div>`
            }    
        }
        
        //console.log(myhtml);

        matchlist.innerHTML= myhtml;
    }
}

export const citiesList =async ()=>{
    let requiredCity;
    requiredCity = $("#cities-list").val();
    return `&addressFilter=stateCode=${requiredCity}`;
}

export const searchStates = async (searchText,getCity) => {
    
    let setState="";
    if(getCity!='&stateCode='){
        setState=getCity;
    }
    const res = await fetch(`https://places.ls.hereapi.com/places/v1/autosuggest?in=21.0201,77.9803;r=2010440&nt=900-9100-0216${setState}&q=${searchText}&size=5&apiKey=0Sb-LBR-H3b1SzCdTSyOltaD9XZe9RsmxrSTpWxWghk`);
    let states = await res.json();
    
    if(searchText.length === 0 || searchText.length===" "){
        states.results = [];
        matchlist.innerHTML='';
        $(function(){
            $("#match-list").show();
        })
    }
    if(searchText.length!=0){
        $('#search1').click(()=>{
            $('#match-list').show();
        })
    }


    cityFilter(states.results);

    //outputHtml(states.results);

}


