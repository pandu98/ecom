import React,{useState} from 'react'
import Base from "../core/Base"
import {Link ,Redirect} from "react-router-dom";
import { authenticate, isAuthenticated, signin } from '../auth/helper';


const Signup =()=>{

    const [values,setValues]=useState({
      
        email:"",
        password:"",
        error:"",
        success:false,
        loading:false,
        didRedirect:false
    });



    const{email,password,error,success,loading,didRedirect}=values;

    const handleChange = name =>event=>{
        setValues({...values,error:false,[name]:event.target.value})
    };
  


    const onSumit =(event)=>{
        event.preventDefault();
        setValues({...values,error:false,loading:true})


        signin({email,password})
        .then(data =>{
            console.log("DATA",data);
if(data.token){
    //let sessionToken =data.token;
    authenticate(data,()=>{
        console.log("TOKKEN ADDED");
        setValues({
            ...values,
            didRedirect:true,
        });
    })
}
else{
    setValues({
        ...values,
        loading:false,
    })
}
        })
        .catch(e=>console.log(e));
    };


const performRedirect=()=>{
    if(isAuthenticated()){
        return <Redirect to="/"/>
    }
}

const loadingMessage=()=>{
    return(
        loading &&(
            <div className="alert alert-info">
                <h2>Loading...</h2>
            </div>
        )
    )
}




    const successMessage=()=>{
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-success" 
                    style={{display : success?"": "none" }}>
                        new account created successfully.Please <Link to="/signin" >login now.</Link>
                    </div>
                </div>
            </div>
        )
    };
    
    
    
    
    
    const errorMessage=()=>{
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-danger" 
                    style={{display : error?"": "none" }}>
                        check all feilds again
                    </div>
                </div>
            </div>
        )
    };
    
    
     const signinForm=()=>{
         return (
             <div className="row">
                 <div className="col-md-6 offset-sm-3 text-left">
                     <form>
                     
    
                            <div className="form-group">
                             <label className="text-light">Email</label>
                             <input
                             className="form-control"
                             value={email}
                             onChange={handleChange("email")}
                             type="text"
                             />
                             
                            </div>
    
                            <div className="form-group">
                             <label className="text-light">password</label>
                             <input
                             className="form-control"
                             value={password}
                             onChange={handleChange("password")}
                             type="password"
                             />
                             
                            </div>
                            <button
                            onClick={onSumit}
                            className="btn btn-success btn-block">Submit</button>
                     </form>
                 </div>
             </div>
         )
     }












    return(
        <Base title="Welocme to sign in page" description="A tshirt store">
            {loadingMessage()}
            
            {signinForm()}
            <p className="text-center">{JSON.stringify(values)}</p>
            {performRedirect()}
        </Base>
    )
};



export default Signup;