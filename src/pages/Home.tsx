import React from "react";
import { Link } from "react-router-dom";
import { Search, BarChart3, Info, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Personnel Database
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive database for tracking and analyzing personnel records with advanced search capabilities and detailed statistics.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/search">
              <Button size="lg" className="bg-inadvertent-yellow hover:bg-inadvertent-yellow-hover">
                <Search className="mr-2 h-5 w-5" />
                Access Database
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                <Info className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Search className="h-6 w-6 text-inadvertent-yellow" />
                Advanced Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                Search personnel records by name, badge number, division, classification, and more with powerful filtering options.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BarChart3 className="h-6 w-6 text-inadvertent-yellow" />
                Statistics & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                View comprehensive statistics including compensation data, division breakdowns, and personnel analytics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="h-6 w-6 text-inadvertent-yellow" />
                Secure Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                Password-protected access ensures that sensitive personnel information remains secure and accessible only to authorized users.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="bg-card rounded-lg p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Database Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-inadvertent-yellow mb-2">1000+</div>
              <div className="text-muted-foreground">Personnel Records</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-inadvertent-yellow mb-2">25+</div>
              <div className="text-muted-foreground">Divisions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-inadvertent-yellow mb-2">10+</div>
              <div className="text-muted-foreground">Classifications</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-inadvertent-yellow mb-2">24/7</div>
              <div className="text-muted-foreground">Access Available</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Access the personnel database to search records, view statistics, and analyze data.
          </p>
          <Link to="/search">
            <Button size="lg" className="bg-inadvertent-yellow hover:bg-inadvertent-yellow-hover">
              <Search className="mr-2 h-5 w-5" />
              Enter Database
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;