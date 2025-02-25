import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const SplashPage = () => {
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
            
            <Button variant="outline" className="w-full bg-white hover:bg-slate-100 text-slate-800 border-slate-300">
              <FaGoogle className="mr-2" />
              Sign in with Google
            </Button>
          </CardContent>
          
          <CardFooter className="text-center">
            <p className="text-slate-400 text-sm mx-auto">
              Photos and content updated weekly as we progress through our build
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <div className="relative w-full h-1/4 md:h-1/3 max-h-60 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-slate-950/90 z-10"></div>
        <div 
          className="absolute inset-0 bg-[url('/car-silhouette.png')] bg-no-repeat bg-center bg-contain opacity-20"
          style={{ filter: 'brightness(0.7) contrast(1.2)' }}
        ></div>
      </div>
      
      <footer className="bg-slate-950 py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Factory Five MK5 Build Journey
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SplashPage;