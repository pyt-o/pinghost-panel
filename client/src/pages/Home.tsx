import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { 
  Zap, 
  Shield, 
  Headphones, 
  Clock, 
  Rocket, 
  BarChart3,
  ChevronRight,
  Star,
  Check,
  Loader2
} from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const features = [
    {
      icon: Zap,
      title: 'Wydajność',
      description: 'Wydajność stawiamy na pierwszym miejscu. Serwery wyposażone w procesory Intel Xeon Gold oraz AMD Ryzen',
    },
    {
      icon: Shield,
      title: 'Ochrona Anty-DDoS',
      description: 'Topowa ochrona Anty-DDoS, która jest niezbędna dla niezakłóconej pracy Twoich usług',
    },
    {
      icon: Headphones,
      title: 'Szybkie Wsparcie',
      description: 'Nasz zespół techniczny jest dostępny o każdej porze, aby zagwarantować niezawodność',
    },
    {
      icon: Clock,
      title: 'Wysoka Dostępność',
      description: 'Nasze usługi działają 24/7 z gwarancją uptime 99.9%',
    },
    {
      icon: Rocket,
      title: 'Proste Wdrożenie',
      description: 'Instalacja serwera jest prosta i intuicyjna. Wystarczy kilka kliknięć',
    },
    {
      icon: BarChart3,
      title: 'Przejrzysty Panel',
      description: 'Nasz panel jest przejrzysty i prosty w obsłudze. Zarządzanie staje się przyjemnością',
    },
  ];

  const packages = [
    {
      name: 'Minecraft',
      price: '2,70',
      period: 'zł/miesiąc',
      description: 'Idealny dla małych serwerów',
      features: [
        'Wydajne Procesory AMD Ryzen',
        'Szybkie Dyski SSD NVMe',
        'Polska Lokalizacja',
        'Ochrona Anty-DDoS Premium',
        'Darmowa Subdomena',
      ],
      popular: false,
    },
    {
      name: 'VPS',
      price: '15,00',
      period: 'zł/miesiąc',
      description: 'Dla zaawansowanych użytkowników',
      features: [
        'Wydajne Procesory AMD/Intel',
        'Szybkie Dyski SSD NVMe',
        'Polska Lokalizacja',
        'Ochrona Anty-DDoS Premium',
        'Łącze do 1Gb/s burst',
      ],
      popular: true,
    },
    {
      name: 'Discord Boty',
      price: '2,99',
      period: 'zł/miesiąc',
      description: 'Dla botów Discord',
      features: [
        'Wydajne Procesory AMD Ryzen',
        'Szybkie Dyski SSD NVMe',
        'Polska Lokalizacja',
        'Ochrona Anty-DDoS Premium',
        'Obsługa Node.JS i Python',
      ],
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: 'Hankuu',
      text: 'Hosting mega mi się podoba jest zadziwiająco stabilny i niezawodny, support jest bardzo uprzejmy, panel serwera jest bardzo łatwy w obsłudze',
      rating: 5,
    },
    {
      name: 'papiczak',
      text: 'Hosting mimo że nowy to warty uwagi, administracja miła i pomocna, serwery stabilne i adekwatne do ceny',
      rating: 5,
    },
    {
      name: 'husuku.lol',
      text: 'Hosting bardzo dobry stabilny nie mam z nim żadnych problemów, a support jest bardzo miły',
      rating: 5,
    },
    {
      name: 'wexon',
      text: 'Polecam Hosting, fajny przejrzysty i estetyczny panel a osiągi serwera również są zadowalające',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">PingHost</div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="outline" onClick={() => setLocation(user?.role === 'admin' ? '/admin' : '/dashboard')}>
                  {t('common.dashboard')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <a href={getLoginUrl()}>Zaloguj się</a>
                </Button>
                <Button asChild>
                  <a href={getLoginUrl()}>Rejestracja</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Najwyższy poziom wydajności
            </h1>
            <p className="text-xl text-muted-foreground">
              Oferujemy szybki i niezawodny hosting Minecraft i VPS KVM, który zapewnia doskonałe warunki dla Ciebie i Twoich usług. Łączymy stabilność, wydajność i elastyczność.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" asChild>
                <a href={getLoginUrl()}>
                  Sprawdź teraz <ChevronRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline">
                Dołącz do społeczności
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Wsparcie techniczne</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">132Tbps</div>
              <div className="text-muted-foreground">Ochrona Anty-DDoS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Dlaczego PingHost</h2>
            <p className="text-xl text-muted-foreground">Wszystko czego potrzebujesz do sukcesu</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-card-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 md:py-32 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Poznaj naszą ofertę</h2>
            <p className="text-xl text-muted-foreground">Elastyczne pakiety dostosowane do Twoich potrzeb</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative bg-card border-border transition-all ${
                  pkg.popular ? 'md:scale-105 border-primary shadow-lg' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4" /> NAJPOPULARNIEJSZY
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-card-foreground">{pkg.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-4xl font-bold text-primary">
                      Od {pkg.price}
                    </div>
                    <div className="text-muted-foreground">{pkg.period}</div>
                  </div>

                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-card-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" asChild>
                    <a href={getLoginUrl()}>
                      Sprawdź <ChevronRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Co mówią o nas klienci</h2>
            <p className="text-xl text-muted-foreground">Opinie naszych zadowolonych użytkowników</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-card-foreground">{testimonial.name}</CardTitle>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary/10">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-4xl font-bold">Gotowy na start?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dołącz do tysięcy zadowolonych klientów i zacznij korzystać z naszych usług już dziś
          </p>
          <Button size="lg" asChild>
            <a href={getLoginUrl()}>
              Utwórz konto <ChevronRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-card-foreground">PingHost</h3>
              <p className="text-muted-foreground">Hosting, który zapewnia stabilność, wydajność i elastyczność</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-card-foreground">Linki</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Panel Klienta</a></li>
                <li><a href="#" className="hover:text-primary">Status Usług</a></li>
                <li><a href="#" className="hover:text-primary">Dokumentacja</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-card-foreground">Dokumenty</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Polityka Prywatności</a></li>
                <li><a href="#" className="hover:text-primary">Regulamin</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-card-foreground">Social Media</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Discord</a></li>
                <li><a href="#" className="hover:text-primary">YouTube</a></li>
                <li><a href="#" className="hover:text-primary">TikTok</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>© PingHost 2024-2025 All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
