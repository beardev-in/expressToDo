import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../components/ui/sheet";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../components/ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '../../components/ui/popover';
import { Label } from '../../components/ui/label';
import { uploadAvatar, deleteAvatar, selectProfileInfo, updateAge, updateAvatarModal } from './profileSlice';
import { selectDashboardInfo, updateUserInfo } from '../dashboard/dashboardSlice';
import axios from 'axios';
import store from '../../app/store';


const ProfileTab: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { avatarModal, updatedAge } = useSelector(selectProfileInfo);
    const { userDetails } = useSelector(selectDashboardInfo);

    const handleLogout = async () => {
        try {
            await axios.get('/api/user/logout');
            localStorage.clear();
            navigate("/login");
        } catch (error: any) {
            console.error(error.response.data);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        store.dispatch(uploadAvatar(formData));
    };

    const handleDeleteAvatar = async () => {
        store.dispatch(deleteAvatar());
    };

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">Profile</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <div className="flex flex-col items-center cursor-pointer" onClick={() => dispatch(updateAvatarModal(true))}>
                            <Avatar className='bg-black inline-block mr-4 w-24 h-24'>
                                <AvatarImage src={userDetails.avatar && `http://localhost:8080/user-profiles/${userDetails.avatar}`} alt="avatar" />
                                <AvatarFallback>a</AvatarFallback>
                            </Avatar>
                            <SheetTitle className='mt-2'>Welcome, {userDetails.firstname}!</SheetTitle>
                        </div>
                        {avatarModal && (
                            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg">
                                    <button
                                        onClick={() => dispatch(updateAvatarModal(false))}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                    >
                                        x
                                    </button>
                                    <div className="flex flex-col items-center">
                                        <Avatar className='bg-black inline-block mb-4 w-64 h-64'>
                                            <AvatarImage src={userDetails.avatar && `http://localhost:8080/user-profiles/${userDetails.avatar}`} alt="avatar" />
                                            <AvatarFallback>a</AvatarFallback>
                                        </Avatar>
                                        <div className="flex space-x-4">
                                            <label htmlFor="file-upload" className="cursor-pointer bg-black text-white px-4 py-2 rounded hover:bg-gray-500">
                                                Upload
                                                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                            </label>
                                            <button onClick={handleDeleteAvatar} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-500">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">User details</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="width">email</Label>
                                            <div className="text-xs">{userDetails.email}</div>
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="maxWidth">age</Label>
                                            <div className="text-xs">{userDetails.age}</div>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </SheetHeader>
                    <br />
                    <SheetDescription>
                        Make changes to your profile here.
                    </SheetDescription>
                    <div className="mt-2 mr-6 inline-block w-[70%]">
                        <Select value={updatedAge} onValueChange={(value: string) => dispatch(updateAge(value))}>
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
                    <SheetFooter className='inline-block w-[10%]'>
                        <SheetClose asChild>
                            <Button type="submit" onClick={() => store.dispatch(updateUserInfo(updatedAge))}>update</Button>
                        </SheetClose>
                        <Button variant="outline" onClick={handleLogout} className="absolute bottom-4 right-4">Logout</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default ProfileTab;