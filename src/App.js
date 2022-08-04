import { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post/Post';
import db, { auth } from './firebase';
import { collection, orderBy, query, onSnapshot } from 'firebase/firestore';
import { Modal, Button, Box, Input } from '@mui/material';
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut, signInWithEmailAndPassword } from "firebase/auth";
import ImageUpload from './components/ImageUpload/ImageUpload';
import { InstagramEmbed } from 'react-social-media-embed';


function App() {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const colRef = collection(db, 'posts');
    const q = query(colRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        })
      ));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    
    const changeUser = onAuthStateChanged(auth,(authUser) => {
      if(authUser){
        //user has logged in
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      changeUser();
    };

  }, [user]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const signUp = (e) => {

    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
       .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          updateProfile(user, {
            displayName: username
          })
          // alert(username);
        })
        .catch((error) => {
          alert(error.code);
          alert(error.message);
          // ..
        });

    setOpen(false);

  };

  const logout = () => {
    signOut(auth).then(() => {
      alert("Sign-out successful");
    }).catch((error) => {
      alert(error.message);
    });
  };

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      alert(`Welcome, ${user.displayName}`);
    })
    .catch((error) => {
      alert(error.code + error.message);
    });

  setOpenSignIn(false);
  };


  return (

    <div className="app">

        <Modal open={open} onClose={() => setOpen(false)}>

          <Box sx={style}>

            <form className='appSignUp'>
              
              <center>
                <img 
                  src="https://static.cdninstagram.com/rsrc.php/v3/yD/r/W0ohjlcRCmd.png" 
                  alt="Instagram logo" 
                  className='appHeaderImage'
                  />              
              </center>

              <Input
                placeholder='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                placeholder='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                placeholder='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type='submit' onClick={signUp}> Sign Up </Button>

            </form>

          </Box>

        </Modal>

        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>

          <Box sx={style}>

            <form className='appSignIn'>
              
              <center>
                <img 
                  src="https://static.cdninstagram.com/rsrc.php/v3/yD/r/W0ohjlcRCmd.png" 
                  alt="Instagram logo" 
                  className='appHeaderImage'
                  />              
              </center>

              <Input
                placeholder='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                placeholder='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type='submit' onClick={signIn}> Sign In </Button>

            </form>

          </Box>

        </Modal>

        <div className="appHeader">
            <img 
              src="https://static.cdninstagram.com/rsrc.php/v3/yD/r/W0ohjlcRCmd.png" 
              alt="Instagram logo" 
              className='appHeaderImage'
              />

        {
          user ? (
            <Button className='authButton' onClick={logout}>Logout</Button>
          ) : (
            <div className="loginContainer">
              <Button className='authButton' onClick={() => setOpen(true)}>Sign Up</Button>
              <Button className='authButton' onClick={() => setOpenSignIn(true)}>Login</Button>
            </div>     
          )
        }

        </div>

        <div className="appPosts">

            <div className="appPostsLeft">
                {
                  posts.map(({id, post}) => {
                    return (
                      <Post 
                        key={id}
                        postId={id} 
                        username={post.username} 
                        caption={post.caption} 
                        imageUrl={post.imageUrl} 
                        user={user}
                      />
                    )
                  })
                }  
            </div>

            <div className="appPostsRight">
                <InstagramEmbed 
                  url='https://www.instagram.com/p/CbcYmSAj1ek/' 
                  width={320} 
                />
            </div>

        </div>


        {user?.displayName ? (
            <ImageUpload username={user.displayName} />
          ): (
            null
          )
        }

    </div>

  );

};

export default App;
