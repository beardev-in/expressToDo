import React, { useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormData, clearAlert, clearFieldErrors, registerUser, selectRegisterationInfo } from './registerSlice';
import store from '../../app/store';
import { initialRegisterStateType } from '../types';

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formData, alert, fieldErrors } : initialRegisterStateType = useSelector(selectRegisterationInfo);

  useEffect(() => {
    if (alert || fieldErrors) {
      setTimeout(() => {
        dispatch(clearAlert());
        dispatch(clearFieldErrors());
        if(alert && alert.type == "success"){
            navigate('/login');
        }
      }, 3000);
    }
  }, [alert, fieldErrors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ [name]: value }));
  };

  const handleValueChange = (value: string) => {
    dispatch(updateFormData({ age: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.dispatch(registerUser(formData));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        {alert && alert.type === 'success' && (
          <Alert>
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
        {alert && alert.type === 'failure' && (
          <Alert>
            <AlertTitle>Oops!</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fieldErrors && fieldErrors.firstname && (
            <Alert variant="destructive">
              <AlertDescription>{fieldErrors.firstname}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="firstname" className="block text-gray-700">Firstname</Label>
            <Input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          {fieldErrors && fieldErrors.email && (
            <Alert variant="destructive">
              <AlertDescription>{fieldErrors.email}</AlertDescription>
            </Alert>
          )}
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
          {fieldErrors && fieldErrors.password && (
            <Alert variant="destructive">
              <AlertDescription>{fieldErrors.password}</AlertDescription>
            </Alert>
          )}
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
          {fieldErrors && fieldErrors.age && (
            <Alert variant="destructive">
              <AlertDescription>{fieldErrors.age}</AlertDescription>
            </Alert>
          )}
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

export default Register;