import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchPersons } from "@/services/clientService";

type Person = {
  id: string;
  name: string;
  birth_date?: Date;
  disability?: string;
  is_admin: boolean;
  phone?: string;
  email?: string;
  city?: string;
  neigh?: string;
  notes?: string;
  registration_date: Date;
};

const calcularIdade = (birth_date?: Date): number | undefined => {
  if (!birth_date) return undefined;
  const hoje = new Date();
  let idade = hoje.getFullYear() - birth_date.getFullYear();
  const mes = hoje.getMonth() - birth_date.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < birth_date.getDate())) {
    idade--;
  }
  return idade;
};

const BuscarClientes = () => {
  const { data: clientes = [], isLoading } = useQuery<Person[]>({
    queryKey: ["clientes"],
    queryFn: fetchPersons,
  });

  const [name, setName] = useState("");
  const [address, setAddress] = useState("all");
  const [neighborhood, setNeighborhood] = useState("all");
  const [ageRange, setAgeRange] = useState<string>("all");
  const [disability, setDisability] = useState("all");

  // Extrair cidades únicas a partir do campo address (pode ajustar conforme dados reais)
  const addressesUnique = useMemo(() => {
    return [...new Set(clientes.map((c) => c.city).filter(Boolean))];
  }, [clientes]);

  const neighborhoodsUnique = useMemo(() => {
    return [...new Set(clientes.map((c) => c.neigh).filter(Boolean))];
  }, [clientes]);

  const filteredClients = useMemo(() => {
    return clientes.filter((client) => {
      if (name && !client.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }

      if (address !== "all" && client.city !== address) {
        return false;
      }

      if (neighborhood !== "all" && client.neigh !== neighborhood) {
        return false;
      }

      const age = calcularIdade(client.birth_date);
      if (ageRange !== "all") {
        if (age === undefined) return false;
        if (ageRange === "0-18" && (age < 0 || age > 18)) {
          return false;
        }
        if (ageRange === "19-30" && (age < 19 || age > 30)) {
          return false;
        }
        if (ageRange === "31-50" && (age < 31 || age > 50)) {
          return false;
        }
        if (ageRange === "51+" && age < 51) {
          return false;
        }
      }

      if (disability !== "all" && client.disability !== disability) {
        return false;
      }

      return true;
    });
  }, [clientes, name, address, neighborhood, ageRange, disability]);

  const clearFilters = () => {
    setName("");
    setAddress("all");
    setNeighborhood("all");
    setAgeRange("all");
    setDisability("all");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          Buscar Pessoas
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Utilize os filtros abaixo para encontrar pessoas cadastradas no
          sistema.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtros de pesquisa</CardTitle>
          <CardDescription>
            Refine sua busca utilizando os filtros disponíveis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input
                placeholder="Nome do cliente"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cidade</label>
              <Select
                onValueChange={setAddress}
                value={address}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {addressesUnique.map((addr) => (
                    <SelectItem key={addr} value={addr}>
                      {addr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bairro</label>
              <Select
                onValueChange={setNeighborhood}
                value={neighborhood}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um bairro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os bairros</SelectItem>
                  {neighborhoodsUnique.map((nb) => (
                    <SelectItem key={nb} value={nb}>
                      {nb}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Faixa etária</label>
              <Select onValueChange={setAgeRange} value={ageRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa etária" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as idades</SelectItem>
                  <SelectItem value="0-18">0-18 anos</SelectItem>
                  <SelectItem value="19-30">19-30 anos</SelectItem>
                  <SelectItem value="31-50">31-50 anos</SelectItem>
                  <SelectItem value="51+">51+ anos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de deficiência</label>
              <Select onValueChange={setDisability} value={disability}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de deficiência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as deficiências</SelectItem>
                  <SelectItem value="motora">Motora</SelectItem>
                  <SelectItem value="visual">Visual</SelectItem>
                  <SelectItem value="auditiva">Auditiva</SelectItem>
                  <SelectItem value="intelectual">Intelectual</SelectItem>
                  <SelectItem value="multipla">Múltipla</SelectItem>
                  <SelectItem value="mental">Mental</SelectItem>
                  <SelectItem value="fisica">Física</SelectItem>
                  <SelectItem value="outra">Outra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-medium">
            Resultados ({isLoading ? "..." : filteredClients.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nenhuma pessoa encontrada com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Deficiência</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody> 
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium text-blue-700">
                      {client.name}
                    </TableCell>
                    <TableCell>
                      {client.birth_date ? calcularIdade(client.birth_date) + ' anos' : "-"}
                    </TableCell>
                    <TableCell className="capitalize">
                      {client.disability ?? "-"}
                    </TableCell>
                    <TableCell>{client.city ?? "-"}</TableCell>
                    <TableCell>{client.neigh ?? "-"}</TableCell>
                    <TableCell>{client.email ?? "-"}</TableCell>
                    <TableCell>{client.phone ?? "-"}</TableCell>
                    <TableCell>
                      {format(client.registration_date, "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      {client.is_admin ? "Sim" : "Não"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscarClientes;
