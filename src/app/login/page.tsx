import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SignIn from '@/components/sign-in';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 to-slate-950">
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <Card className="max-w-md w-full mx-auto border-slate-800 bg-slate-950/70 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl md:text-5xl font-bold text-white">Factory Five MK5</CardTitle>
            <CardDescription className="text-2xl md:text-3xl font-semibold text-blue-400">Build Journey</CardDescription>
          </CardHeader>
          
          <div className="px-6">
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />
          </div>
          
          <CardContent className="pt-6">
            <p className="text-slate-300 mb-8 text-center">
              Follow our adventure building a Factory Five MK5 Roadster from the ground up. 
              Sign in to access build logs, photos, and more.
            </p>
            
           <SignIn></SignIn>
          </CardContent>
          
          <CardFooter className="text-center">
            <p className="text-slate-400 text-sm mx-auto">
              Photos and content updated weekly as we progress through our build
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <footer className="bg-slate-950 py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
            © 2025 Sanders Factory Five MK5 Build Journey
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;