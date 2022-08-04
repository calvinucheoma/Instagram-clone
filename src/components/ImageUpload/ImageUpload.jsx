import { Button } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import db, { storage } from '../../firebase';
import './ImageUpload.css';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {addDoc, collection, serverTimestamp } from "firebase/firestore";


const ImageUpload = ({username}) => {

  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {    //to prevent multiple files from being loaded when the user selects multiple files but rather only the first file gets accepted
        setImage(e.target.files[0]);
    }  
  };

  const handleUpload = () => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', 
    (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // alert('Upload is ' + progress + '% done');
        setProgress(progress);

        // switch (snapshot.state) {
        //     case 'paused':
        //         alert('Upload is paused');
        //         break;
        //     case 'running':
        //         alert('Upload is running');
        //         break;
        // }
    }, 
    (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors

        // switch (error.code) {
        //     case 'storage/unauthorized':
        //         // User doesn't have permission to access the object
        //         alert(error.code);
        //         break;
        //     case 'storage/canceled':
        //         // User canceled the upload
        //         alert('Upload was canceled');
        //         break;
        //     case 'storage/unknown':
        //         // Unknown error occurred, inspect error.serverResponse
        //         alert('Unknown error occured while uploading');
        //         console.log(error.code + error.serverResponse);
        //         break;
        // };
        alert(error.code);
    }, 
    () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                // console.log('File available at', downloadURL);
                addDoc(collection(db, 'posts'), {
                    timestamp: serverTimestamp(),
                    caption: caption,
                    imageUrl: downloadURL,
                    username: username
                });
                setProgress(0);
                setCaption('');
                setImage(null);
            });
          }
    );
  };

  return (

    <div className='imageUpload'>

        <progress className='imageUploadProgress' value={progress} max='100' />

        <input 
            type="text" 
            placeholder='Enter a caption...' 
            onChange={(e) => setCaption(e.target.value)} 
            value={caption} 
        />

        <input type="file" onChange={handleChange} />

        <Button onClick={handleUpload}> Upload</Button>

    </div>

  )

};

export default ImageUpload;