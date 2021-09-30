import {API} from "../../backend";
import {cartEmpty} from "../../core/helper/carthelper";

export const signup =(user)=>{
    return fetch(`${API}user/`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json",

        },
        body:JSON.stringify(user),
    })
    .then((response)=>{
        return response.json();
    })
    .catch((err)=>console.log(err));
}

export const signin =user=>{

    const formData=new FormData();
    for (const name in user){
        formData.append(name,user[name])
    }

for(var key of formData.keys()){
    console.log("MYKEY: ",key);
}



    return fetch(`${API}user/login/`,{
        method:"POST",
        body:formData,
    })
    .then((response)=>
    {   console.log("success",response);
        return response.json();
    })
    .catch((err)=>console.log(err));
};

export const authenticate=(data,next)=>{
    if(typeof window !== undefined){
        localStorage.setItem("jwt",JSON.stringify(data));
        next();
    }
};

export const isAuthenticated=()=>{
    if(typeof window ==undefined){
        return false
    }

    if(localStorage.getItem("jwt")){
        console.log("hello world");
        console.log(localStorage.getItem("user"));
        return(JSON.parse(localStorage.getItem("jwt")));
    }
    else{
        return false;

    }
};

export const signout =(next)=>{
   
    const userID =isAuthenticated() && isAuthenticated().user.id;


    if(typeof window !==undefined){
        localStorage.removeItem("jwt")
        cartEmpty(()=>{});
       return fetch(`${API}uswer/logout/${userID}`,{
           method:"GET"
       })
       .then(response =>{
           console.log("signout success")
           next();
       })
       .catch(err=>console.log(err));


    }

}









