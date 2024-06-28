const Footer = () => {
  return (
      <footer className="bg-slate-900 p-4 mt-20 mx-auto">
          <hr className="border-t border-gray-200 "  />
          <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
              <div className="text-center md:text-left pb-2 md:pb-0">
                  <p className="text-sm text-gray-500">
                      © {new Date().getFullYear()} Prakhar Deep Has, All rights reserved.
                  </p>
              </div>
              <div className='flex flex-wrap justify-center md:justify-end items-center mt-2 md:mt-0'>
                  <div className='flex space-x-4 text-gray-500'>
                      <a href='#' className='text-sm text-gray-500 hover:text-gray-600'>
                          Terms
                      </a>
                      <a href='#' className='text-sm text-gray-500 hover:text-gray-600'>
                          Privacy Policy
                      </a>
                      <a href='#' className='text-sm text-gray-500 hover:text-gray-600'>
                          Cookie Policy
                      </a>
                      <a href='mailto:prakhardeep173@gmail.com' className='text-sm text-gray-500 hover:text-gray-600'>
                          Contact
                      </a>
                  </div>
              </div>
              <div className="text-center md:text-right mt-2 md:mt-0">
                  <p className="text-sm text-gray-500">
                      Made with 👦 in India
                  </p>
              </div>
          </div>
      </footer>
  );
}

export default Footer;
