import { supabase } from "@/lib/supabase";

export type AuthResponse = {
  accessToken: string;
  isAdmin: boolean;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // 1) Autentica via Supabase Auth
  const {
    data: authData,
    error: authError,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.session) {
    throw new Error(authError?.message || "Credenciais inválidas");
  }

  const accessToken = authData.session.access_token;

  // 2) Busca a coluna is_admin na tabela person
  const { data: person, error: personError } = await supabase
    .from("person")
    .select("is_admin")
    .eq("email", email)
    .single();

  if (personError || !person) {
    throw new Error("Não foi possível verificar permissões do usuário");
  }

  return {
    accessToken,
    isAdmin: person.is_admin,
  };
};
