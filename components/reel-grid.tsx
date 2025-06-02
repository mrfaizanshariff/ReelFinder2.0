"use client"

import { useState, useEffect } from 'react';
import { Reel } from '@/components/search-container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Instagram, RefreshCw } from 'lucide-react';

interface ReelGridProps {
  reels: Reel[];
  error: string | null;
  username: string;
  searchKey: string;
}

export function ReelGrid({ reels, error, username, searchKey }: ReelGridProps) {
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [renderedReels, setRenderedReels] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Reset and re-render Instagram embeds when reels change
    if (reels.length > 0) {
      setRenderedReels(reels.map((reel, index) => (
        <div key={`reel-${index}`} className="instagram-embed-container min-h-[400px] w-full flex items-center justify-center relative overflow-hidden rounded-lg bg-muted/50">
          <div 
            className="instagram-post w-full max-w-full overflow-hidden"
            dangerouslySetInnerHTML={{ __html: reel }}
          />
          <a 
            href={reel.post_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 text-xs bg-black/70 text-white px-2 py-1 rounded-full flex items-center gap-1 hover:bg-black/90 transition-all"
          >
            <Instagram className="h-3 w-3" />
            View on Instagram
          </a>
        </div>
      )));
      
     
    } else {
      setRenderedReels([]);
    }
  }, [reels]);

  if (error) {
    return (
      <Card className="mt-8 border-destructive/50">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-destructive/10 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold">Search Error</h2>
            <p className="text-muted-foreground max-w-md">{error}</p>
            <p className="text-sm text-muted-foreground">Please check the username and try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reels.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-muted p-3 rounded-full">
              <Instagram className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No Reels Found</h2>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any reels from @{username} {searchKey ? `with keyword "${searchKey}"` : ''}.
            </p>
            <p className="text-sm text-muted-foreground">Try a different username or keyword.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-8 space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Search Results</h2>
          <p className="text-muted-foreground">
            Found {reels.length} reel{reels.length !== 1 ? 's' : ''} for @{username}
            {searchKey ? ` with keyword "${searchKey}"` : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline" 
            size="sm"
            onClick={() => {
              if (window.instgrm) {
                window.instgrm.Embeds.process();
        console.log("embed process");

              }
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Embeds
          </Button>
          
          <Tabs 
            value={displayMode} 
            onValueChange={(value) => setDisplayMode(value as 'grid' | 'list')} 
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div 
        className={`w-full ${
          displayMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-6'
        }`}
      >
        {renderedReels}
      </div>
    </div>
  );
}