"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";


export default function UserPage(){
    const {session, status} = useSession();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.email) {
            console.log("USER AUTHENTICATED!!!");
        } else if (status !== "loading") {
            setLoading(false)
        }
    }, [status, session]);

    if (loading) return <p>Loading...</p>

    if (status === 'unauthenticated') {
        return (
            <div>
              <p>You must sign in</p>
              <button onClick={() => signIn()}>Sign In</button>
            </div>
          )
    }

    return (
        <div>
          <h1>User Info</h1>
          <p>Signed in as: {session.user.email}</p>
          <p>Name: {session.user.name}</p>
          {session.user.image && <img src={session.user.image} alt="User Image" style={{ width: 50, height: 50 }} />}
          {/*  */}
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      )
}