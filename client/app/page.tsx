import { redirect } from "next/navigation";

// Permite redirecionar para a página de login al entrar a nuestra aplicación
export default function Home() {
  redirect("/login");
}
