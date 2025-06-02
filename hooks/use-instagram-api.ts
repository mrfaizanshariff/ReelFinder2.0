"use client"

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface InstagramReel {
  embed_code: string;
  post_url: string;
  thumbnail_url?: string;
}

export function useInstagramApi() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<InstagramReel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const searchReels = async (username: string, searchKey: string = '') => {
    if (!username) {
      setError('Username is required');
      toast({
        title: "Username required",
        description: "Please enter an Instagram username to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

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
      
      if (data && Array.isArray(data)) {
        setResults(data);
        if (data.length === 0) {
          toast({
            title: "No results found",
            description: `No reels found for @${username} with keyword "${searchKey || 'any'}"`,
            variant: "default",
          });
        } else {
          toast({
            title: "Search complete",
            description: `Found ${data.length} reels for @${username}`,
            variant: "default",
          });
        }
      } else {
        setResults([]);
        setError('Unexpected response format from server');
        toast({
          title: "Error",
          description: "Received an invalid response from the server",
          variant: "destructive",
        });
      }
    } catch (err) {
      setResults([]);
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

  return {
    isLoading,
    results,
    error,
    searchReels
  };
}