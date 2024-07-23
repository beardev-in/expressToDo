import React, { useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormData, clearAlert, loginUser, selectLoginInfo } from './loginSlice';
import store from '../../app/store';
import { initialLoginStateType } from '../types';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formData, alert } : initialLoginStateType = useSelector(selectLoginInfo);

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        dispatch(clearAlert());
        if (alert.type === 'success') {
          navigate('/dashboard');
        }
      }, 3000);
    }
  }, [alert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.dispatch(loginUser(formData));
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
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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