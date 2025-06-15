
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, Heart, ExternalLink, BookOpen, Users, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const HelpPage: React.FC = () => {
  return (
    <div className="min-h-screen starry-background text-starry-text">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-starry-muted hover:text-starry-text transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-starry-text text-glow mb-2">
            Help & Support
          </h1>
          <p className="text-starry-muted text-lg">
            Find the support and resources you need
          </p>
        </div>

        {/* Crisis Help Section - Priority */}
        <Card className="glass-panel border-red-500/30 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-red-400">
              <Shield className="w-6 h-6 mr-2" />
              Crisis Help - Available 24/7
            </CardTitle>
            <CardDescription className="text-starry-muted">
              If you're in immediate danger or having thoughts of self-harm, please reach out for help immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-starry-text">Emergency Services</h3>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-red-400" />
                  <span className="text-starry-text font-mono">911</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-starry-text">National Suicide Prevention Lifeline</h3>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-red-400" />
                  <span className="text-starry-text font-mono">988</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-starry-text">Crisis Text Line</h3>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                <span className="text-starry-text">Text HOME to <span className="font-mono">741741</span></span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center text-starry-text">
                <BookOpen className="w-5 h-5 mr-2 text-starry-highlight" />
                Mental Health Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 glass-panel">
                  <div>
                    <div className="font-medium text-starry-text">NAMI (National Alliance on Mental Illness)</div>
                    <div className="text-sm text-starry-muted">Support, education, and advocacy</div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto text-starry-muted" />
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 glass-panel">
                  <div>
                    <div className="font-medium text-starry-text">Mental Health America</div>
                    <div className="text-sm text-starry-muted">Mental health screening and resources</div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto text-starry-muted" />
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 glass-panel">
                  <div>
                    <div className="font-medium text-starry-text">Psychology Today</div>
                    <div className="text-sm text-starry-muted">Find therapists and support groups</div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto text-starry-muted" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center text-starry-text">
                <Users className="w-5 h-5 mr-2 text-starry-highlight" />
                Support Communities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 glass-panel">
                  <div>
                    <div className="font-medium text-starry-text">7 Cups</div>
                    <div className="text-sm text-starry-muted">Free emotional support and counseling</div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto text-starry-muted" />
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 glass-panel">
                  <div>
                    <div className="font-medium text-starry-text">Support Groups Central</div>
                    <div className="text-sm text-starry-muted">Find local and online support groups</div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto text-starry-muted" />
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 glass-panel">
                  <div>
                    <div className="font-medium text-starry-text">Reddit Mental Health</div>
                    <div className="text-sm text-starry-muted">Community support and discussions</div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto text-starry-muted" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Self-Care Resources */}
        <Card className="glass-panel mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-starry-text">
              <Heart className="w-5 h-5 mr-2 text-starry-highlight" />
              Self-Care & Wellness
            </CardTitle>
            <CardDescription className="text-starry-muted">
              Tools and techniques to support your mental well-being
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 glass-panel rounded-lg">
                <h3 className="font-semibold text-starry-text mb-2">Breathing Exercises</h3>
                <p className="text-sm text-starry-muted">Simple techniques to manage anxiety and stress</p>
              </div>
              <div className="p-4 glass-panel rounded-lg">
                <h3 className="font-semibold text-starry-text mb-2">Mindfulness Apps</h3>
                <p className="text-sm text-starry-muted">Headspace, Calm, and Insight Timer</p>
              </div>
              <div className="p-4 glass-panel rounded-lg">
                <h3 className="font-semibold text-starry-text mb-2">Journaling</h3>
                <p className="text-sm text-starry-muted">Express thoughts and track mood patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How MindfulCompanion Can Help */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-starry-text">How MindfulCompanion Can Help</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-starry-text mb-2">24/7 Support</h3>
                <p className="text-sm text-starry-muted">
                  Get immediate support and coping strategies anytime you need them.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-starry-text mb-2">Private & Confidential</h3>
                <p className="text-sm text-starry-muted">
                  Your conversations are completely private and secure.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-starry-text mb-2">Personalized Care</h3>
                <p className="text-sm text-starry-muted">
                  Receive support tailored to your specific needs and situation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-starry-text mb-2">Not a Replacement</h3>
                <p className="text-sm text-starry-muted">
                  While helpful, MindfulCompanion is not a substitute for professional mental health care.
                </p>
              </div>
            </div>
            <div className="pt-4">
              <Link to="/chat">
                <Button className="bg-starry-highlight hover:bg-starry-highlight/80 text-white">
                  Start Chatting with MindfulCompanion
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;
