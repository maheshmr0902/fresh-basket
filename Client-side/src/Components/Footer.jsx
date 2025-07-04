import { assets, footerLinks } from "../assets/assets";
import logo from '../assets/Logo3.jpg';

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-34 bg-secondary/10" aria-label="Footer" id='footer'>
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
        {/* Left Side - Logo & Description */}
        <div>
          <img className="w-34 md:w-32 bg-pvt" src={logo} alt="Fresh Basket Logo" />
          <p className="max-w-[410px] mt-6">
            Fresh Basket delivers fresh, organic groceries and snacks to your door.
            Trusted by thousands, we make shopping easy and affordable.
          </p>
        </div>

        {/* Right Side - Footer Links */}
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <a href={link.url} className="hover:underline transition">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Copyright */}
      <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
        Copyright {new Date().getFullYear()} ©  Fresh Basket. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
