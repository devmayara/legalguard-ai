import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, FileCheck, Shield, Zap, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileCheck,
      title: "Análise Inteligente",
      description: "IA analisa cada cláusula e identifica pontos críticos do seu contrato"
    },
    {
      icon: Shield,
      title: "Proteção Jurídica",
      description: "Receba alertas sobre riscos e cláusulas potencialmente prejudiciais"
    },
    {
      icon: Zap,
      title: "Orientação Personalizada",
      description: "Sugestões de negociação baseadas no seu papel e tipo de contrato"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center">
              <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow">
                <Scale className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Análise de Contratos com
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Inteligência Artificial</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Entenda cada cláusula, identifique riscos e receba orientações personalizadas 
              para negociar com confiança
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => navigate("/auth")}
              >
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8"
                onClick={() => navigate("/auth")}
              >
                Fazer Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Como Funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nossa IA analisa contratos de forma profunda, oferecendo insights 
              jurídicos e estratégias de negociação
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl border border-border bg-gradient-card shadow-card hover:shadow-glow transition-all"
              >
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-2xl bg-gradient-card border border-border shadow-glow text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pronto para Analisar Seu Contrato?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já tomam decisões mais informadas 
              com nossa assistência jurídica por IA
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate("/auth")}
            >
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
