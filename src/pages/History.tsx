import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, ArrowLeft, FileText, Calendar, User } from "lucide-react";

const History = () => {
  const navigate = useNavigate();

  // TODO: Buscar dados reais do banco de dados
  const analyses = [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">Histórico de Análises</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Suas Análises</h2>
            <p className="text-muted-foreground">
              Visualize e gerencie todas as suas análises de contratos
            </p>
          </div>

          {analyses.length === 0 ? (
            <Card className="border-border shadow-card">
              <CardContent className="py-16">
                <div className="text-center space-y-4">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Nenhuma análise encontrada
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Você ainda não realizou nenhuma análise de contrato
                    </p>
                    <Button onClick={() => navigate("/analyze")}>
                      Analisar Primeiro Contrato
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {/* Placeholder para futuras análises */}
              {analyses.map((analysis: any) => (
                <Card key={analysis.id} className="border-border shadow-card hover:shadow-glow transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{analysis.contractName}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {analysis.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {analysis.role}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Análise
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;
