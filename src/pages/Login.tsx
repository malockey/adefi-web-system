import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { login, AuthResponse } from "@/services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Mutação para login
  const mutation = useMutation<AuthResponse, Error, { email: string; password: string }>({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: ({ accessToken, isAdmin }) => {
      // Armazena token e flag de admin, então redireciona
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("is_admin", isAdmin ? "true" : "false");
      window.location.href = "/"; // ou sua rota inicial
    },
    onError: (error) => {
      setErrorMsg(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Preencha email e senha.");
      return;
    }
    mutation.mutate({ email, password });
  };

  // React Query v4 expõe `isLoading`
  const loading = mutation.status === "pending";


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white-100 to-white-300">
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-2xl">
        <CardContent>
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
            {errorMsg && (
              <p className="text-red-500 text-sm">{errorMsg}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
