import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Upload, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Analyze = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [contractType, setContractType] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        toast.success("Arquivo carregado com sucesso!");
      } else {
        toast.error("Por favor, envie apenas arquivos PDF");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success("Arquivo carregado com sucesso!");
    }
  };

  const handleAnalyze = async () => {
    if (!file || !contractType || !userRole) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Apenas arquivos PDF são aceitos");
      return;
    }

    // Mapeamento dos valores do Select para os textos completos esperados pelo webhook
    const contractTypeMap: Record<string, string> = {
      "aluguel": "Aluguel",
      "compra-venda": "Compra e Venda",
      "prestacao-servicos": "Prestação de Serviços",
      "trabalho": "Contrato de Trabalho",
      "parceria": "Parceria Comercial",
      "confidencialidade": "Confidencialidade (NDA)",
      "outros": "Outros"
    };

    const userRoleMap: Record<string, string> = {
      "locatario": "Locatário/Inquilino",
      "locador": "Locador/Proprietário",
      "comprador": "Comprador",
      "vendedor": "Vendedor",
      "contratante": "Contratante",
      "contratado": "Contratado/Prestador",
      "empregado": "Empregado",
      "empregador": "Empregador",
      "reveladora": "Parte Reveladora",
      "receptora": "Parte Receptora",
      "outros": "Outros"
    };

    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('contract', file);
      formData.append('contract_type', contractTypeMap[contractType] || contractType);
      formData.append('contract_role', userRoleMap[userRole] || userRole);
      
      // Não definir Content-Type manualmente - o browser define automaticamente
      // com o boundary correto para multipart/form-data
      const response = await fetch('https://id5-n8n.fly.dev/webhook-test/contract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro na análise: ${response.status}`);
      }

      const result = await response.json();
      
      // O webhook pode retornar diferentes formatos:
      // 1. {"message": "Workflow was started"} - workflow iniciado (assíncrono)
      // 2. {"analysis": "markdown text"} - resultado direto
      // 3. {"text": "markdown text"} - resultado em campo text
      // 4. [{"text": "markdown text"}] - resultado em array
      // 5. String direta com markdown
      
      let analysisText: string | null = null;
      
      // Tenta extrair o texto de análise em diferentes formatos
      if (typeof result === 'string') {
        // Resposta é uma string direta (markdown)
        analysisText = result;
      } else if (result?.analysis) {
        // Campo "analysis" contém o markdown
        analysisText = result.analysis;
      } else if (result?.text) {
        // Campo "text" contém o markdown
        analysisText = result.text;
      } else if (Array.isArray(result) && result.length > 0) {
        // Array com resultado
        if (result[0]?.text) {
          analysisText = result[0].text;
        } else if (result[0]?.analysis) {
          analysisText = result[0].analysis;
        } else if (typeof result[0] === 'string') {
          analysisText = result[0];
        }
      }
      
      // Se encontrou o texto de análise, redireciona para resultados
      if (analysisText) {
        navigate("/results", { 
          state: { 
            analysis: analysisText,
            contractName: file.name,
            contractType: contractTypeMap[contractType] || contractType,
            contractRole: userRoleMap[userRole] || userRole,
            analysisDate: new Date().toISOString()
          } 
        });
        toast.success("Análise concluída com sucesso!");
      } else if (result?.message) {
        // Workflow iniciado mas ainda processando (assíncrono)
        toast.success("Análise iniciada com sucesso! Processando contrato...");
        console.log("Workflow iniciado:", result.message);
        // Aqui você pode implementar polling ou webhook callback se necessário
      } else {
        throw new Error("Resposta inválida do servidor: formato não reconhecido");
      }
      
    } catch (error) {
      console.error('Erro ao analisar contrato:', error);
      toast.error(
        error instanceof Error 
          ? `Erro: ${error.message}` 
          : "Erro ao analisar o contrato. Tente novamente."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

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
              <span className="font-semibold">Análise de Contrato</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Upload Card */}
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Enviar Contrato
              </CardTitle>
              <CardDescription>
                Faça upload do arquivo PDF do contrato para análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                  dragActive
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-4">
                    <FileText className="h-12 w-12 mx-auto text-primary" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFile(null)}
                    >
                      Remover arquivo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        Arraste e solte seu contrato aqui
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ou clique para selecionar o arquivo
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Selecionar Arquivo
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contract Details Card */}
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle>Informações do Contrato</CardTitle>
              <CardDescription>
                Forneça detalhes sobre o tipo de contrato e seu papel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contract-type">Tipo de Contrato</Label>
                <Select value={contractType} onValueChange={setContractType}>
                  <SelectTrigger id="contract-type">
                    <SelectValue placeholder="Selecione o tipo de contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluguel">Aluguel Imobiliário</SelectItem>
                    <SelectItem value="compra-venda">Compra e Venda</SelectItem>
                    <SelectItem value="prestacao-servicos">Prestação de Serviços</SelectItem>
                    <SelectItem value="trabalho">Contrato de Trabalho</SelectItem>
                    <SelectItem value="parceria">Parceria Comercial</SelectItem>
                    <SelectItem value="confidencialidade">Confidencialidade (NDA)</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-role">Seu Papel no Contrato</Label>
                <Select value={userRole} onValueChange={setUserRole}>
                  <SelectTrigger id="user-role">
                    <SelectValue placeholder="Selecione seu papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="locatario">Locatário/Inquilino</SelectItem>
                    <SelectItem value="locador">Locador/Proprietário</SelectItem>
                    <SelectItem value="comprador">Comprador</SelectItem>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                    <SelectItem value="contratante">Contratante</SelectItem>
                    <SelectItem value="contratado">Contratado/Prestador</SelectItem>
                    <SelectItem value="empregado">Empregado</SelectItem>
                    <SelectItem value="empregador">Empregador</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                onClick={handleAnalyze}
                disabled={!file || !contractType || !userRole || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analisando contrato...
                  </>
                ) : (
                  "Analisar Contrato"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analyze;
