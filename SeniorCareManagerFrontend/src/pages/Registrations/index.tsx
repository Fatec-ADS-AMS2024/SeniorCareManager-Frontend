import { FolderPlus } from "@phosphor-icons/react";
import Card from "../../components/Card";
import { routes } from "../../routes/routes";

export default function Registrations() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Página de Cadastros</h1>
        <Card text="Religião" subText="Religiões Cadastradas" icon={<FolderPlus/>} page={routes.RELIGIONREGISTRATION}/>
      </div>
    );
  }