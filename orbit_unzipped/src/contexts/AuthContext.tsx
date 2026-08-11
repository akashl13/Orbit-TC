import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import supabase from '../lib/supabase';
const AuthContext = createContext<{user: User | null; session: Session | null; loading: boolean}>({ user:null, session:null, loading:true });
export function AuthProvider({children}:{children:React.ReactNode}) { const [user,setUser]=useState<User|null>(null); const [session,setSession]=useState<Session|null>(null); const [loading,setLoading]=useState(true); useEffect(()=>{ supabase.auth.getSession().then(({data})=>{setSession(data.session);setUser(data.session?.user??null);setLoading(false)}); const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>{setSession(next);setUser(next?.user??null);setLoading(false)}); return ()=>subscription.unsubscribe(); },[]); return <AuthContext.Provider value={{user,session,loading}}>{children}</AuthContext.Provider> }
export const useAuth=()=>useContext(AuthContext);
