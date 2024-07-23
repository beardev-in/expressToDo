import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Registration: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    email: '',
    password: '',
    age: ''
  });

  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string } | null>(null);

  //e -> event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleValueChange = (value: string) => {
    setFormData({ ...formData, age: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      //all requests starting with /api are forwarded to backend server configured
      let res = await axios.post("/api/user/register", formData);
      console.log(res.data.success);
      if (res.data.success.msg) {
        setAlert({
          type: "success",
          message: res.data.success.msg
        });
      }
      setTimeout(() => {
        navigate('/login');
      }, 2500)
    } catch (error: any) {
      console.log(error.response.data);

      type badInput = {
        msg: string,
        path: string,
        type: string,
        value: string,
        location: string
      }
      //accounts for all types of errors
      let userErrors: {
        errors?: badInput[],
        msg?: string,
        path?: string
      } = error.response.data.error
      let errorFields: {
        [key: string]: string;
      } = {};
      
      if (userErrors.path == "badInput") {
        userErrors.errors!.forEach((err) => {
          errorFields[err.path] = err.msg
        })
        // setFieldErrors(_ => {
        //   return errorFields;
        // });
        setFieldErrors(errorFields);
      } else {        
        setAlert({
          type: "failure",
          message: error.response.data.error.msg
        });
      }
      console.log(fieldErrors);
      console.log(alert);
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
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {
            fieldErrors && fieldErrors.firstname &&
            <Alert variant="destructive">
              <AlertDescription>
                {fieldErrors.firstname}
              </AlertDescription>
            </Alert>
          }
          <div>
            <Label htmlFor="firstname" className="block text-gray-700">Firstname</Label>
            <Input
              type="text"
              id="username"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          {
            fieldErrors && fieldErrors.email &&
            <Alert variant="destructive">
              <AlertDescription>
                {fieldErrors.email}
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
              <AlertDescription>
                {fieldErrors.password}
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
          {
            fieldErrors && fieldErrors.age &&
            <Alert variant="destructive">
              <AlertDescription>
                {fieldErrors.age}
              </AlertDescription>
            </Alert>
          }
          <div>
            <Label htmlFor="age" className="block text-gray-700">Age</Label>
            <div className="mt-2">
              <Select value={formData.age} onValueChange={handleValueChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Age</SelectLabel>
                    {Array.from({ length: 49 }, (_, i) => i + 12).map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </div>
    </div>
  );
};

