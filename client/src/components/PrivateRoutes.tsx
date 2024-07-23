import React, {useEffect, useState} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';


type authorised = boolean;

const PrivateRoutes: React.FC = () => {
    const navigate = useNavigate();
    const [authorised, setAuthorised] = useState<authorised>(false);
    
    useEffect(()=>{
      let userInfo = localStorage.getItem('userInfo');
      
      if(userInfo){
        async function fetchInitialData() {
          try { 
            let {token} = JSON.parse(userInfo!);
            let res = await axios.post(`/api/user/token-auth`, {},  {
            headers: {
                'x-auth-header': token, 
              },
            })            
            if(res.data.success) setAuthorised(true);
          } catch (error : any) {
            console.log(error.response.data);
            navigate("/login")
          }
        }
        fetchInitialData();
      }else{
        navigate("/login")
      }
  
    }, [])

    return (
        authorised && (
            <>
            {/* can render a unified layout for all private routes */}
                <main className='bg-gray-100 min-h-screen p-5'>
                    <Outlet />
                </main>
            </>
        )
    );
};

export default PrivateRoutes;