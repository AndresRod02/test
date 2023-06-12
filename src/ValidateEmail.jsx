import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';


const ValidateEmail = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token');
    const [data, setData] = useState(null)
    useEffect(()=>{
        if(token){
            axios.post("http://localhost:8000/users/email-validate", { token })
                .then(resp=>setData(resp.data))
                .catch(error=>setData(error.data))
        }
    }, [token])
    return (
        <div>
            <h1>Chiwua</h1>
            <p>Estamos validando tu correo</p>
            
        </div>
    );
};

export default ValidateEmail;