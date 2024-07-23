import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// type Props = {
//   setUser: React.Dispatch<React.SetStateAction<string | null>>;
//   setToken: React.Dispatch<React.SetStateAction<string | null>>;
// };

const Login: React.FC = () => { //<Props>
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      //all requests starting with /api are forwarded to backend server configured
      let res = await axios.post("/api/user/login", formData);
      console.log(res.data);
      if (res.data.success.msg) {
        setAlert({
          type: "success",
          message: res.data.success.msg
        });
        let userInfo : {firstname : string, token : string} = {
          firstname : res.data.success.user,
          token : res.data.success.authtoken
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      }
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000)
    } catch (error: any) {
      console.log(error.response.data);
      setAlert({
        type: "failure",
        message: error.response.data.error.msg
      });
    } finally {
      setTimeout(() => {
        setAlert(null);
        setFieldErrors(null);
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        {
          alert && alert.type == "success" &&
          <Alert>
            <AlertTitle>success!</AlertTitle>
            <AlertDescription>
              {alert.message}
            </AlertDescription>
          </Alert>
        }
        {
          alert && alert.type == "failure" &&
          <Alert>
            <AlertTitle>oops!</AlertTitle>
            <AlertDescription>
              {alert.message}
            </AlertDescription>
          </Alert>
        }
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {
            fieldErrors && fieldErrors.email &&
            <Alert variant="destructive">
              <AlertTitle>{fieldErrors.email}</AlertTitle>
              <AlertDescription>
                {fieldErrors.firstname}
              </AlertDescription>
            </Alert>
          }
          <div>
            <Label htmlFor="email" className="block text-gray-700">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          {
            fieldErrors && fieldErrors.password &&
            <Alert variant="destructive">
              <AlertTitle>{fieldErrors.password}</AlertTitle>
              <AlertDescription>
                {fieldErrors.firstname}
              </AlertDescription>
            </Alert>
          }
          <div>
            <Label htmlFor="password" className="block text-gray-700">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;