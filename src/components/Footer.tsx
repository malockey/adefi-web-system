
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">ADEFI</h3>
            <p className="text-blue-200">
              Promovendo inclusão e melhor qualidade de vida para pessoas com deficiências físicas.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <p className="text-blue-200 mb-2">Email: adefionline@gmail.com</p>
            {/* <p className="text-blue-200 mb-2">Telefone: (00) 1234-5678</p> */}
            <p className="text-blue-200">Endereço: José Eugenio Müller, 99 - Vila Operária, Itajaí 88303170</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Siga-nos</h3>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/people/ADEFI-Itaja%C3%AD/61554146786820/" className="text-blue-200 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="https://www.instagram.com/adefioficial/" className="text-blue-200 hover:text-white transition-colors" target="_blank"> 
                Instagram
              </a>
              {/* <a href="#" className="text-blue-200 hover:text-white transition-colors">
                Twitter
              </a> */}
            </div>
          </div>
        </div>
        <div className="border-t border-blue-600 mt-6 pt-6 text-center text-blue-200">
          <p>&copy; {new Date().getFullYear()} ADEFI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
