"use client"

import { useState, useEffect } from 'react';
import { SearchForm } from '@/components/search-form';
import { ReelGrid } from '@/components/reel-grid';
import { InstagramEmbed } from '@/components/instagram-embed';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';

export interface Reel {
  embed_code: string;
  post_url: string;
  thumbnail_url?: string;
}

export function SearchContainer() {
  const [username, setUsername] = useState<string>('');
  const [searchKey, setSearchKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reels, setReels] = useState<Reel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const { toast } = useToast();

  // Load Instagram embed script when results are displayed
  useEffect(() => {
    if (reels.length > 0) {
      // Load Instagram embed.js script
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Clean up script when component unmounts
        document.body.removeChild(script);
      };
    }
  }, [reels]);
  const handleSearch = async (username: string, searchKey: string) => {
    if (!username) {
      toast({
        title: "Username required",
        description: "Please enter an Instagram username to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const response = await fetch('https://instagram-post-finder-fastapi.onrender.com/get-embed-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, search_key: searchKey }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      setTimeout(() => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
          console.log("embed process");
          
        }
      }, 500);
      if (data ) {
        setReels(data?.embed_codes);
         // Trigger Instagram embed script
       
        if (data.embed_codes.length === 0) {
          toast({
            title: "No results found",
            description: `No reels found for @${username} with keyword "${searchKey || 'any'}"`,
            variant: "default",
          });
        } else {
          toast({
            title: "Search complete",
            description: `Found ${data.embed_codes.length} reels for @${username}`,
            variant: "default",
          });
        }
      } else {
        setReels([]);
        setError('Unexpected response format from server');
        toast({
          title: "Error",
          description: "Received an invalid response from the server",
          variant: "destructive",
        });
      }
    } catch (err) {
      setReels([]);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <header className="w-full py-6 px-4 md:py-10 md:px-6 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-gradient-x mb-3">
            ReelsFinder
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Find the perfect Instagram reels by searching any username and keyword
            BTW This works only for public profiles, so sorry you can't stalk your ex
          </p>
        </div>
      </header>

      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <SearchForm 
          username={username} 
          searchKey={searchKey}
          setUsername={setUsername}
          setSearchKey={setSearchKey}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
        
        {isLoading && (
          <div className="w-full flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 relative animate-spin">
              <div className="h-16 w-16 rounded-full border-4 border-t-indigo-500 border-b-pink-500 border-l-transparent border-r-transparent"></div>
            </div>
            <p className="mt-4 text-muted-foreground">Searching for reels...</p>
          </div>
        )}

        {!isLoading && hasSearched && (
          <ReelGrid reels={reels} error={error} username={username} searchKey={searchKey} />
        )}
      </div>
      
      {/* <InstagramEmbed /> */}
      
      <footer className="w-full py-6 px-4 mt-auto border-t">
        <div className="container mx-auto max-w-6xl">
          <p className="text-center text-sm text-muted-foreground">
            ReelFinder © {new Date().getFullYear()} • Not affiliated with Instagram or Meta
          </p>
        </div>
      </footer>
    </div>
  );
}