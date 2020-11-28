using System;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using server2.Services;

namespace server2.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [EnableCors("AllowAll")]
    public class TrafficController : Controller
    {
        private readonly ILogger<TrafficController> _logger;

        public TrafficController(ILogger<TrafficController> logger)
        {
            _logger = logger;
        }

        [HttpGet("/data")]
        public IActionResult Get()
        {
            Console.WriteLine("Dishing");
            var data = new Traffic().getTrafficData();
            Response.Headers.Add("Content-Length", 3241662.ToString());
            return new ObjectResult(data);
        }
    }
}