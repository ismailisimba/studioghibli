const localVar = {}
const detailsContainer = document.getElementById("deets");

window.onload = () => {
    fetchInfoWithFilter().then((ghibliApiObject)=>{
        //console.log(ghibliApiObject);
        localVar["cloudObj"] = ghibliApiObject;
        readStudioGhibliObject(ghibliApiObject);
    });
   
}




async function fetchInfoWithFilter () {

    var myRequest = new Request("https://ghibliapi.herokuapp.com/films?limit=250");
           
    const returnVal = await fetch(myRequest, {
      method: 'GET', 
      mode: 'cors', 
      cache: 'default',
      credentials: 'omit', 
      redirect: 'follow', 
      referrerPolicy: 'no-referrer'
    })
          .then(function(response) {
            if (!response.ok) {
              
              throw new Error("HTTP error, status = " + response.status);
              
            }
            
            return response.text();
          })
          .then(function(myBlob) {
            
            var cloudObject = JSON.parse(myBlob);
            
          
            return cloudObject;
            
          })
          .catch(function(error) {
            var p = document.createElement('p');
            p.appendChild(
              document.createTextNode('Error: ' + error.message)
            );
            document.querySelectorAll(".descriptioncontainer")[0].innerHTML = "";
            document.querySelectorAll(".descriptioncontainer")[0].appendChild(p);
          });
          return returnVal; 
  };


  function readStudioGhibliObject(ghibliApiObject) {
      const ghibliFilms = Object.entries(ghibliApiObject)
      const objectSize =  ghibliFilms.length;
      const itemsContainer = document.getElementById("movietit");
      itemsContainer.innerHTML = "";

     // console.log(ghibliFilms);
      //console.log(objectSize);

      for(i=0;i<objectSize;i++){
          let optionEle = document.createElement("option");
          optionEle.value = ghibliFilms[i][1].title;
          optionEle.innerText = ghibliFilms[i][1].title;
          itemsContainer.appendChild(optionEle);
      }

          upDateDescription("first");

      itemsContainer.addEventListener("input",()=>{
          upDateDescription();
      })


  };


  function upDateDescription(context) {
      detailsContainer.innerHTML="";
      if(context==="first"){
          let myKey = document.createElement("p");
          myKey.className = "items";
          let objectEntries =  Object.entries(localVar.cloudObj[0]);
          let objectKeys = Object.keys(localVar.cloudObj[0]);
          document.querySelectorAll("h1")[0].innerHTML = localVar.cloudObj[0].original_title;
          

          for(i=0;i<objectEntries.length;i++){
              let copyKey = myKey.cloneNode(true);
              copyKey.innerHTML = objectKeys[i].toUpperCase()+" : "+objectEntries[i][1];
              detailsContainer.appendChild(copyKey);
          }
      }else{
          let thisFilmObject = searchForFilm(document.getElementById("movietit").value);
          let myKey = document.createElement("p");
          myKey.className = "items";
          let objectEntries =  Object.entries(thisFilmObject);
          let objectKeys = Object.keys(thisFilmObject);
          document.querySelectorAll("h1")[0].innerHTML = thisFilmObject.original_title;
          

          for(i=0;i<objectEntries.length;i++){
              let copyKey = myKey.cloneNode(true);
              copyKey.innerHTML = objectKeys[i].toUpperCase()+" : "+objectEntries[i][1];
              detailsContainer.appendChild(copyKey);
          }
          
      }

  }


  function searchForFilm(searchQuery){
      let obj = {"Not":"Found"};

      for(i=0;i<localVar.cloudObj.length;i++){
          if(searchQuery===localVar.cloudObj[i].title){
              obj = localVar.cloudObj[i];
          }
      }

      return obj;
  };