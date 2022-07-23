using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace webapp.Pages
{   
    public class HomeModel : PageModel
    {    
        private readonly ILogger<HomeModel> _logger;
             
        public HomeModel(ILogger<HomeModel> logger)
        {
            _logger = logger;
        }
          
        public void OnGet()
        {

        }
    }
}
