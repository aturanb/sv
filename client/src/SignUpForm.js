import React, { useState } from 'react';
import { functions } from './config/firebase';
import { httpsCallable } from "firebase/functions";


function SignUpForm() {
    const signUpCloud = httpsCallable(functions, 'signUp');

    const [formData, setFormData] = useState({
        email: "",
        emailVerified: false,
        phoneNumber: "",
        password: "",
        displayName: "",
        photoURL: "",
        disabled: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signUpCloud({ personInfo: formData })
        .then((response) => {
        // Read result of the Cloud Function.
        const data = response.data;
        console.log('returned data:', data.result);
      })
      .catch((error) => {
        console.error('Error adding message:', error);
      });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
            <label>
                Phone Number:
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </label>
            <label>
                Password:
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </label>
            <label>
                Display Name:
                <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} />
            </label>
            <label>
                Photo URL:
                <input type="text" name="photoURL" value={formData.photoURL} onChange={handleChange} />
            </label>
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default SignUpForm;