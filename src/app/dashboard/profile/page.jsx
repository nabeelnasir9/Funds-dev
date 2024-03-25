"use client"

import React from 'react'
import { http } from "@/lib/config";
import { apiUrls } from '@/lib/apis';

const page = () => {
    const [user, setUser] = React.useState({});
    const [isUpdate, setIsUpdate] = React.useState(false);
    const [updateData, setUpdateData] = React.useState({});

    React.useEffect(() => {
        const getUser = async () => {
            try {
                let userToken = localStorage.getItem("token");

                const bodyData = { token: userToken };
                console.log(userToken, "=============", bodyData);
                let res = await http.post(apiUrls.users.me, bodyData);
                console.log(res, "---------------------------");
                setUser(res?.data);
            } catch (error) {
                console.log(error);
            }
        };
        getUser();
    }, []);
    return (
        <div className=" mx-auto w-full mt-10 p-5 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">User Information</h2>
            <p><strong>Username:</strong> {user?.username}</p>

            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Status:</strong> {user.status}</p>
            <p><strong>Leave Balance:</strong> Sick - {user?.leavesBalance?.sick}, Casual - {user?.leavesBalance?.casual}</p>
            <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            <p><strong>Role:</strong> {user.role}</p>

            {isUpdate && (
                <div className="mt-5">
                    <input
                        type="password"
                        placeholder="Enter new password"
                        className="border-2 border-gray-300 p-2 rounded-md w-full"
                        onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })}
                    />
                    
                </div>
            )}
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5" onClick={() => {
                setIsUpdate(!isUpdate);
                if (isUpdate) {
                    const updatePassword = async () => {
                        try {
                            let userToken = localStorage.getItem("token");
                            const bodyData = { token: userToken, password: updateData.password };
                            console.log(userToken, "=============", bodyData);
                            let res = await http.post(apiUrls.users.updatePassword, bodyData);
                            console.log(res, "---------------------------");
                            alert("Password updated successfully");
                        } catch (error) {
                            console.log(error);
                        }
                    };
                    updatePassword();
                }
            }}>
                {isUpdate ? "Save" : "Update Password"}
            </button>

                </div>
    )
}


export default page