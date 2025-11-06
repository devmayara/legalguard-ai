import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Upload, History, LogOut, FileText } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName] = useState("Usuário"); // TODO: Obter do estado de autenticação

  const handleLogout = () => {
    // TODO: Implementar logout
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Scale className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ContractAI</h1>
              <p className="text-xs text-muted-foreground">Assistente Jurídico</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Bem-vindo, {userName}!</h2>
            <p className="text-muted-foreground">
              Envie um contrato para análise ou visualize seu histórico
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border shadow-card hover:shadow-glow transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-gradient-primary transition-all">
                    <Upload className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <CardTitle>Nova Análise</CardTitle>
                    <CardDescription>
                      Envie um contrato para análise por IA
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/analyze")}
                >
                  Analisar Contrato
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border shadow-card hover:shadow-glow transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-gradient-primary transition-all">
                    <History className="h-6 w-6 text-accent group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <CardTitle>Histórico</CardTitle>
                    <CardDescription>
                      Visualize suas análises anteriores
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => navigate("/history")}
                >
                  Ver Histórico
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Analyses */}
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Análises Recentes
              </CardTitle>
              <CardDescription>
                Suas últimas análises de contratos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma análise realizada ainda</p>
                <p className="text-sm mt-2">
                  Comece enviando seu primeiro contrato para análise
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
