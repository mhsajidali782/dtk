import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Video, 
  Link as LinkIcon, 
  ClipboardPaste, 
  Download, 
  Droplet, 
  MonitorPlay, 
  Zap, 
  ShieldCheck,
  ChevronDown 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Index = () => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a TikTok URL",
        variant: "destructive",
      });
      return;
    }

    navigate(`/preview?url=${encodeURIComponent(url)}`);
  };

  const features = [
    {
      icon: Droplet,
      title: "No Watermark",
      description: "Download videos in their original, clean state without any distracting watermarks."
    },
    {
      icon: MonitorPlay,
      title: "HD Quality",
      description: "Save videos in the highest possible quality for the best viewing experience."
    },
    {
      icon: Zap,
      title: "Free & Fast",
      description: "Our service is completely free and optimized for speed, so you don't have to wait."
    },
    {
      icon: ShieldCheck,
      title: "Secure & Private",
      description: "Your privacy is important. We don't store your videos or track your downloads."
    }
  ];

  const steps = [
    {
      icon: LinkIcon,
      title: "1. Copy Link",
      description: "Find your TikTok video and copy the link from the share options."
    },
    {
      icon: ClipboardPaste,
      title: "2. Paste Link",
      description: "Paste the copied link into the input box on our website."
    },
    {
      icon: Download,
      title: "3. Download Video",
      description: "Click the download button to save the video to your device."
    }
  ];

  const faqs = [
    {
      question: "Is this service free to use?",
      answer: "Yes, our TikTok video downloader is completely free to use. There are no hidden charges or subscription fees. You can download as many videos as you like."
    },
    {
      question: "Can I download videos on my phone?",
      answer: "Absolutely! Our website is fully responsive and works on all devices, including iPhones, Android phones, and tablets. Simply open our website in your mobile browser and follow the same steps."
    },
    {
      question: "Is it legal to download TikTok videos?",
      answer: "Downloading videos is generally permissible for personal use. However, you should always respect copyright laws and the intellectual property of the content creators. Do not reuse or distribute downloaded content without permission."
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-40">
      <main className="py-16 space-y-16">
          <section className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
            <div className="space-y-4">

              
              <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
                The Easiest Way to Download TikTok Videos
              </h1>
              <p className="text-lg text-muted-foreground">
                Paste a link to download any TikTok video without a watermark. Fast, free, and in HD.
              </p>
            </div>
                    
            <form onSubmit={handleSubmit} className="w-full max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-2 p-1 bg-card rounded-xl border border-border shadow-card">
                <div className="flex-1 flex items-center gap-2 px-4">
                  <LinkIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste TikTok video link here"
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-12 sm:h-14"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  className="font-bold h-12 sm:h-14 px-6 sm:px-8"
                >
                  Download
                </Button>
              </div>
            </form>
              
          </section>

          {/* How it Works */}
          <section id="how-it-works" className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
              How it Works in 3 Easy Steps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step, index) => (
                <Card key={index} className="p-6 flex flex-col items-center text-center gap-4 bg-card/50 border-border hover:border-primary/30 transition-all">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Features */}
          <section id="features" className="space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Why Choose Our Video Downloader?
              </h2>
              <p className="text-muted-foreground">
                Enjoy high-quality, watermark-free downloads at lightning speed, completely free of charge and with your privacy in mind.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 space-y-3 bg-card/50 border-border hover:border-primary/30 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-8 pb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, index) => (
                <Collapsible key={index}>
                  <Card className="bg-card/50 border-border overflow-hidden">
                    <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <span className="font-medium text-foreground text-left">{faq.question}</span>
                      <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform [[data-state=open]>&]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
};

export default Index;
