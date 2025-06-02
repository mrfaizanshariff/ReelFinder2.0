"use client"

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Instagram, Sparkles } from 'lucide-react';

interface SearchFormProps {
  username: string;
  searchKey: string;
  setUsername: (username: string) => void;
  setSearchKey: (searchKey: string) => void;
  onSearch: (username: string, searchKey: string) => void;
  isLoading: boolean;
}

export function SearchForm({ 
  username, 
  searchKey, 
  setUsername, 
  setSearchKey, 
  onSearch, 
  isLoading 
}: SearchFormProps) {
  const { toast } = useToast();
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter an Instagram username to search",
        variant: "destructive",
      });
      return;
    }
    onSearch(username, searchKey);
  };

  return (
    <Card className={`w-full transition-all duration-300 shadow-lg ${isFocused ? 'shadow-purple-200 dark:shadow-purple-900/20' : ''}`}>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              <label htmlFor="username" className="text-sm font-medium">
                Instagram Username
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                @
              </span>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kyliejenner"
                className="pl-8 transition-all duration-200 border-input focus:ring-2 focus:ring-purple-500/20"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <label htmlFor="searchKey" className="text-sm font-medium">
                Keyword
              </label>
            </div>
            <Input
              id="searchKey"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="fashion, travel, food..."
              className="transition-all duration-200 border-input focus:ring-2 focus:ring-purple-500/20"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || !username.trim()} 
            className="w-full md:w-auto bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⭘</span>
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Reels
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}