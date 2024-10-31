import Header from "../Header";
import Footer from "../Footer";

export default function Layout() {
  return (
    <div className='flex flex-col text-text bg-background min-h-screen'>
      <Header />

      {/* Conteúdo */}

      <Footer />
    </div>
  );
}
