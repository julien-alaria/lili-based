import { Button } from "@/components/ui/button";
import { Flag, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();        // vide localStorage + met token à null
    navigate("/");   // redirige vers la page d’accueil
  };

  return (
    <div className="bg-blue-950 fixed top-0 w-full text-white h-[60px] flex items-center px-2 justify-between ">
      <div>
        <a href="/" className="flex items-center gap-2">
          <Flag />
          CDPI - Starter
        </a>
      </div>
      {token ? (
        <Button
          className="bg-white text-black hover:bg-gray-200 px-2 py-2 flex"
          onClick={handleLogout}
        >
          <LogOut />
          Deconnexion
        </Button>
      ) : (
        <div className="flex item-center gap-2 ">
          <a
            className="bg-white text-black hover:bg-gray-200 px-2 py-2"
            href="/auth/login"
          >
            Connexion
          </a>
          <a
            className="bg-white text-black hover:bg-gray-200 px-2 py-2"
            href="/auth/register"
          >
            Inscription
          </a>
        </div>
      )}
    </div>
  );
}
