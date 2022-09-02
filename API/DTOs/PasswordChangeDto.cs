using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class PasswordChangeDto
    {
        public int Id { get; set; }
        
        public string CurrentPassword { get; set; }

        public string NewPassword { get; set; }
    }
}