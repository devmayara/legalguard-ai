import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Calendar, User, Briefcase, Home } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnalysisResult {
  analysis: string;
  contractName: string;
  contractType: string;
  contractRole: string;
  analysisDate: string;
}

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as AnalysisResult;

  if (!state || !state.analysis) {
    navigate("/analyze");
    return null;
  }

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const contractTypeLabels: Record<string, string> = {
    "aluguel": "Aluguel Imobiliário",
    "compra-venda": "Compra e Venda",
    "prestacao-servicos": "Prestação de Serviços",
    "trabalho": "Contrato de Trabalho",
    "parceria": "Parceria Comercial",
    "confidencialidade": "Confidencialidade (NDA)",
    "outros": "Outros"
  };

  const roleLabels: Record<string, string> = {
    "locatario": "Locatário/Inquilino",
    "locador": "Locador/Proprietário",
    "comprador": "Comprador",
    "vendedor": "Vendedor",
    "contratante": "Contratante",
    "contratado": "Contratado/Prestador",
    "empregado": "Empregado",
    "empregador": "Empregador",
    "outros": "Outros"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/analyze")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nova Análise
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">Resultado da Análise</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Contract Metadata */}
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle>Informações do Contrato</CardTitle>
              <CardDescription>Detalhes da análise realizada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Arquivo</p>
                    <p className="font-medium">{state.contractName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data da Análise</p>
                    <p className="font-medium">{formatDate(state.analysisDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Contrato</p>
                    <p className="font-medium">{contractTypeLabels[state.contractType] || state.contractType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Seu Papel</p>
                    <p className="font-medium">{roleLabels[state.contractRole] || state.contractRole}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Result */}
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle>Análise Detalhada</CardTitle>
              <CardDescription>Resultado da análise realizada por IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-foreground mb-4 mt-6" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-foreground mb-3 mt-5" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-foreground mb-2 mt-4" {...props} />,
                    p: ({node, ...props}) => <p className="text-foreground mb-4 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-foreground" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground" {...props} />,
                    li: ({node, ...props}) => <li className="text-foreground" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-foreground" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />
                    ),
                    code: ({node, ...props}) => (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                    ),
                    pre: ({node, ...props}) => (
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                    ),
                    a: ({node, ...props}) => (
                      <a className="text-primary hover:underline" {...props} />
                    ),
                  }}
                >
                  {state.analysis}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate("/analyze")}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Nova Análise
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;