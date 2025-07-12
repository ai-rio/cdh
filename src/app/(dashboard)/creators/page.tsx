'use client';

import { useAuth } from '@/contexts/AuthContext';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter,
  Users,
  Star,
  MapPin,
  Instagram,
  Youtube,
  Twitter,
  TrendingUp,
  Heart,
  MessageCircle
} from "lucide-react";

export default function CreatorsPage() {
  const { user } = useAuth();

  // Mock creators data
  const creators = [
    {
      id: 1,
      name: "Sarah Johnson",
      username: "@sarahjohnson",
      avatar: "",
      category: "Fashion & Lifestyle",
      location: "New York, NY",
      followers: "125K",
      engagement: "4.2%",
      rating: 4.8,
      platforms: ["instagram", "youtube", "twitter"],
      recentWork: ["Fashion Nova", "Sephora", "Nike"],
      priceRange: "$2,000 - $5,000",
      bio: "Fashion enthusiast sharing daily outfits and lifestyle content. Passionate about sustainable fashion and beauty.",
    },
    {
      id: 2,
      name: "Mike Chen",
      username: "@techreviewmike",
      avatar: "",
      category: "Technology",
      location: "San Francisco, CA",
      followers: "89K",
      engagement: "5.1%",
      rating: 4.9,
      platforms: ["youtube", "twitter"],
      recentWork: ["Apple", "Samsung", "Google"],
      priceRange: "$3,000 - $8,000",
      bio: "Tech reviewer and early adopter. Helping people make informed decisions about technology purchases.",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      username: "@emmafoodie",
      avatar: "",
      category: "Food & Beverage",
      location: "Los Angeles, CA",
      followers: "67K",
      engagement: "6.3%",
      rating: 4.7,
      platforms: ["instagram", "youtube"],
      recentWork: ["HelloFresh", "Blue Apron", "Whole Foods"],
      priceRange: "$1,500 - $4,000",
      bio: "Food lover and recipe creator. Sharing delicious recipes and restaurant reviews with my community.",
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border" />
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Users className="h-6 w-6" />
              Find Creators
            </h1>
            <p className="text-sm text-muted-foreground">
              Discover and connect with content creators for your campaigns
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4">
        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search creators by name, category, or location..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Creator Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Creators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                +89 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Different niches
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.2%</div>
              <p className="text-xs text-muted-foreground">
                Above industry avg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                Within 24 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Creators List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Featured Creators</h2>
            <Badge variant="secondary">{creators.length} results</Badge>
          </div>

          {creators.map((creator) => (
            <Card key={creator.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback>
                      {creator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{creator.name}</h3>
                        <p className="text-sm text-muted-foreground">{creator.username}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{creator.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{creator.bio}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Category</p>
                        <Badge variant="outline" className="text-xs">
                          {creator.category}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Followers</p>
                        <p className="text-sm font-medium">{creator.followers}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                        <p className="text-sm font-medium">{creator.engagement}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Price Range</p>
                        <p className="text-sm font-medium">{creator.priceRange}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {creator.location}
                      </div>
                      <div className="flex items-center gap-2">
                        {creator.platforms.map((platform) => (
                          <div key={platform} className="text-muted-foreground">
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">Recent Work:</p>
                      <div className="flex flex-wrap gap-2">
                        {creator.recentWork.map((brand, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {brand}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        View Portfolio
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Message
                        </Button>
                        <Button size="sm">
                          Invite to Campaign
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
